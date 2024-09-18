
const userController = require("../controller/userController");
const authenticateUser = require("../controller/middleware/authenticateUser ");
const router = require("express").Router();

// Route để tìm kiếm người dùng theo trạng thái authenticated
router.get('/find-authenticated', authenticateUser, userController.getAuthenticatedUsers);
// ROute lấy thông tin người dùng theo Id
router.get('/one', userController.getOneById);
// Route để theo dõi người dùng
router.post('/follow-authenticated', authenticateUser, userController.followUser);

// Route để bỏ theo dõi người dùng
router.post('/unfollow-authenticated', authenticateUser, userController.unfollowUser);

// Route để chỉnh sửa thông tin cá nhân
router.put('/update', authenticateUser, userController.updateUserInfo);
// Route để chỉnh sửa user -> page
router.put('/page', authenticateUser, userController.updateUserToPage);
// Route để xác thực người dùng
router.post('/verify-authenticated', authenticateUser, userController.verifyUser);
// Route lấy danh sách follow
router.get('/followers/:userId',authenticateUser, userController.getFollowersByStatus);
// Route lấy danh sách post, shorts
router.get('/getpostnshort/:userId',authenticateUser, userController.getUserPostsAndShorts);

// // Gửi yêu cầu kết bạn
// router.post('/send-request/:userId',authenticateUser, userController.sendFriendRequest);

// // Chấp nhận yêu cầu kết bạn
// router.post('/accept-request/:userId', authenticateUser, userController.acceptFriendRequest);

// // Hủy yêu cầu kết bạn
// router.post('/cancel-request/:userId',authenticateUser, userController.cancelFriendRequest);
// router.post('/cancel-waitaccept/:userId', authenticateUser, userController.cancelWaitAccept);
// // Chặn người dùng
// router.post('/block-user/:userId',authenticateUser, userController.blockUser);
// // Lấy danh sách yêu cầu kết bạn
// router.get('/requested', authenticateUser, userController.getRequestedFriends);
// // Lấy danh sách gợi ý kết bạn
// router.get('/suggested', authenticateUser, userController.getSuggestedFriends);
// // Lấy danh sách lời mời kết bạn
// router.get('/waitaccept', authenticateUser, userController.getWaitAcceptFriends);
// // Lấy danh sách bạn bè
// router.get('/friends', authenticateUser, userController.getFriends);
// router.get('/profile',authenticateUser,userController.getUserByToken);
module.exports = router;