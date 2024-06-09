const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const authController = require("./authController");
const mongoose = require('mongoose');
const userController = {
    getUserByToken: async (req, res, next) => {
        const currentUserId = req.user.id;
        try {
            const user = await User.findById(currentUserId).select('-password'); // Không trả về password
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'There was a problem finding the user.' });
        }
    },
    // Tìm kiếm user theo xxx
    findUserBy: async (req, res, next) => {

        try {
            const keyword = req.body.keyword;
            const from = req.body.from;
            const to = req.body.to;
            const user = await User.find({
                $and: [
                    { name: { $regex: keyword, $options: 'i' } }, // Tìm từ khóa trong tên (không phân biệt chữ hoa/thường)
                    { lever: { $gte: from, $lte: to } } // Điểm số trong khoảng từ 'from' đến 'to'
                ]
            })
                .sort({ point: -1 }) // Sắp xếp giảm dần theo điểm số
                .exec((err, users) => {
                    if (err) {
                        return res.status(500).json({ error: "Lỗi khi truy vấn cơ sở dữ liệu." });
                    }
                    return res.status(200).json(users);
                    // console.log(users);
                    // if (!users) {
                    //     return res.status(404).json({ message: 'Không tìm thấy người dùng' });
                    // }else{

                    // }
                });


        } catch (error) {
            return res.status(500).json({ message: 'code sai' });
        }
    },
    // cập nhật tt tài khoản
    updateUser: async (req, res) => {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(
                req.params.id.trim(),
                {
                    $set: req.body,
                },
                { returnDocument: "after" }
            ).select("+password");
            const returnedUser = {
                ...user._doc
            };
            res.status(200).json(returnedUser);
        } catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    },
    // gửi yêu cầu kết bạn
    sendFriendRequest: async (req, res) => {
        const userId = req.params.userId;
        const currentUserId = req.user.id; // Giả sử bạn có middleware để xác thực và lấy user hiện tại
        try {
            // Tìm người dùng nhận yêu cầu
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            //Kiểm tra nếu đã gửi yêu cầu hoặc đã là bạn bè
            const existingRequest = user.friends.find(friend => friend.friendId.toString() === currentUserId.toString() && (friend.status === 'requested' || friend.status === 'friends'));
            if (existingRequest) {
                return res.status(400).json({ message: 'Friend request already sent or you are already friends' });
            }

            // Thêm yêu cầu kết bạn cho người nhận
            user.friends.push({ friendId: currentUserId, status: 'waitAccept' });
            await user.save();

            // Tạo yêu cầu kết bạn ở trạng thái 'requested' cho người gửi yêu cầu
            const currentUser = await User.findById(currentUserId);
            if (!currentUser) {
                return res.status(404).json({ message: 'Current user not found' });
            }
            currentUser.friends.push({ friendId: userId, status: 'requested' });
            await currentUser.save();

            return res.status(200).json({ message: 'Friend request sent' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    },
    // Chấp nhận yêu cầu kết bạn
    acceptFriendRequest: async (req, res) => {
        const userId = req.params.userId;
        const currentUserId = req.user.id;

        try {
            const user = await User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: 'User not found: ' + currentUserId });
            }
            // Tìm yêu cầu kết bạn
            const friendRequest = user.friends.find(friend => friend.friendId.toString() === userId && friend.status === 'waitAccept');
            if (!friendRequest) {
                return res.status(400).json({ message: 'Friend request not found' });
            }

            // Cập nhật trạng thái yêu cầu
            friendRequest.status = 'friends';
            await user.save();

            // Cập nhật trạng thái cho người gửi yêu cầu
            const sender = await User.findById(userId);
            if (!sender) {
                return res.status(404).json({ message: 'Sender not found: ' + userId });
            }

            const sentRequest = sender.friends.find(friend => friend.friendId.toString() === currentUserId.toString());
            if (sentRequest) {
                sentRequest.status = 'friends';
                await sender.save();
            }

            return res.status(200).json({ message: 'Friend request accepted' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    },
    // Từ chối yêu cầu kết bạn
    cancelFriendRequest: async (req, res) => {
        const userId = req.params.userId;
        const currentUserId = req.user.id;

        try {
            const user = await User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Tìm và xóa yêu cầu kết bạn
            const friendIndex = user.friends.findIndex(friend => friend.friendId.equals(userId) && friend.status === 'requested');
            if (friendIndex === -1) {
                return res.status(400).json({ message: 'Friend request not found' });
            }
            user.friends.splice(friendIndex, 1);
            await user.save();

            // Xóa yêu cầu từ người dùng nhận yêu cầu
            const recipient = await User.findById(userId);
            const recipientIndex = recipient.friends.findIndex(friend => friend.friendId.equals(currentUserId));
            if (recipientIndex !== -1) {
                recipient.friends.splice(recipientIndex, 1);
                await recipient.save();
            }

            return res.status(200).json({ message: 'Friend request cancelled' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    },
    // Từ chối yêu cầu kết bạn
    cancelWaitAccept: async (req, res) => {
        const userId = req.params.userId;
        const currentUserId = req.user.id;
        try {
            const user = await User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Tìm và xóa yêu cầu kết bạn
            const friendIndex = user.friends.findIndex(friend => friend.friendId.equals(userId) && friend.status === 'waitAccept');
            if (friendIndex === -1) {
                return res.status(400).json({ message: 'Friend request not found' });
            }

            user.friends.splice(friendIndex, 1);
            await user.save();

            // Xóa yêu cầu từ người dùng gửi yêu cầu
            const recipient = await User.findById(userId);
            const recipientIndex = recipient.friends.findIndex(friend => friend.friendId.equals(currentUserId));
            if (recipientIndex !== -1) {
                recipient.friends.splice(recipientIndex, 1);
                await recipient.save();
            }
            return res.status(200).json({ message: 'Friend request cancelled' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    },
    // Chặn người dùng
    blockUser: async (req, res) => {
        const userId = req.params.userId;
        const currentUserId = req.user.id;

        try {
            const user = await User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Kiểm tra nếu đã chặn người dùng này
            const existingBlock = user.friends.find(friend => friend.friendId.equals(userId) && friend.status === 'blocked');
            if (existingBlock) {
                return res.status(400).json({ message: 'User already blocked' });
            }

            // Thêm người dùng vào danh sách bị chặn
            user.friends.push({ friendId: userId, status: 'blocked' });
            await user.save();

            return res.status(200).json({ message: 'User blocked' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    },
    getRequestedFriends: async (req, res) => {
        try {
            const currentUserId = req.user.id;
            const user = await User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Lọc danh sách yêu cầu kết bạn có trạng thái là 'requested'
            const requestedFriends = user.friends.filter(friend => friend.status === 'requested');
            const friendIds = requestedFriends.map(friend => friend.friendId);
            let reqFriends = [];
            for (friendId of friendIds) {
                const reqFriend = await User.findById(friendId);
                if (!reqFriend) {
                    continue;
                }
                const body = {
                    idReq: reqFriend._id,
                    name: reqFriend.name,
                    avatar: reqFriend.avatar,
                }
                reqFriends.push(body);
            }
            return res.status(200).json({ reqFriends });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    },
    getWaitAcceptFriends: async (req, res) => {
        try {
            const currentUserId = req.user.id;
            const user = await User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Lọc danh sách yêu cầu kết bạn có trạng thái là 'requested'
            const requestedFriends = user.friends.filter(friend => friend.status === 'waitAccept');
            // Lấy danh sách id của các req
            const friendIds = requestedFriends.map(friend => friend.friendId);
            let reqFriends = [];
            for (const friendId of friendIds) {
                const reqFriend = await User.findById(friendId);
                if (!reqFriend) {
                    continue;
                }
                const body = {
                    idReq: reqFriend._id,
                    name: reqFriend.name,
                    avatar: reqFriend.avatar,

                }
                reqFriends.push(body)
            }
            return res.status(200).json({ reqFriends });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    },
    getSuggestedFriends: async (req, res) => {
        try {
            const currentUserId = req.user.id;
            const user = await User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Tạo một danh sách gợi ý rỗng
            let suggestedFriends = [];
            // Lấy danh sách bạn bè của người dùng
            const friends = user.friends.filter(friend => friend.status === 'friends');
            const reqFriend = user.friends.filter(friend => friend.status === 'requested');
            const aptFrined = user.friends.filter(friend => friend.status === 'waitAccept');
            // Lấy danh sách id của các bạn bè
            const friendIds = friends.map(friend => friend.friendId);
            const reqFriendIds = reqFriend.map(friend => friend.friendId);
            const aptFriendIds = aptFrined.map(friend => friend.friendId);


            // Lặp qua danh sách bạn bè
            for (const friendId of friendIds) {
                const randomFriend = await User.findById(friendId);
                if (!randomFriend) {
                    continue;
                }
                // Lấy danh sách bạn bè của bạn bè ngẫu nhiên
                const randomFriendFriends = randomFriend.friends.filter(friend => friend.status === 'friends');
                const randomFriendFriendIds = randomFriendFriends.map(friend => friend.friendId);
                // Lấy 5 bạn bè ngẫu nhiên từ danh sách bạn bè của bạn bè ngẫu nhiên
                for (let i = 0; i < Math.min(5, randomFriendFriendIds.length); i++) {
                    const suggestedFriendId = randomFriendFriendIds[i];
                    if (suggestedFriendId != currentUserId
                        && !friendIds.includes(suggestedFriendId)
                        && !reqFriendIds.includes(suggestedFriendId)
                        && !aptFriendIds.includes(suggestedFriendId)
                    ) {
                        const suggestedFriend = await User.findById(suggestedFriendId);
                        if (suggestedFriend) {
                            suggestedFriends.push(suggestedFriend);
                        }
                    }
                }
            }

            return res.status(200).json({ suggestedFriends });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    },
    getFriends: async (req, res) => {
        try {
            const currentUserId = req.user.id;
            const user = await User.findById(currentUserId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const requestedFriends = user.friends.filter(friend => friend.status === 'friends');
            const friendIds = requestedFriends.map(friend => friend.friendId);
            let reqFriends = [];
            for (const friendId of friendIds) {
                const reqFriend = await User.findById(friendId);
                if (!reqFriend) {
                    continue;
                }
                const body = {
                    idReq: reqFriend._id,
                    name: reqFriend.name,
                    avatar: reqFriend.avatar,
                }
                reqFriends.push(body);
            }
            return res.status(200).json({ reqFriends });
        } catch (error) {

        }
    },
}
module.exports = userController;