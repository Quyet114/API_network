
const userController = require("../controller/userController");
const authenticateUser = require("../controller/middleware/authenticateUser ");
const router = require("express").Router();

//Get all users
// route.get("/",userController.getAllUser);
// //Get users
// route.get("/:id",userController.getUserId);
// //Delete user
// route.delete("/:id", userController.deleteUser);
//updateUser
//route.put("/:id",userController.updateUser);

// Gửi yêu cầu kết bạn
router.post('/send-request/:userId',authenticateUser, userController.sendFriendRequest);

// Chấp nhận yêu cầu kết bạn
router.post('/accept-request/:userId', authenticateUser, userController.acceptFriendRequest);

// Hủy yêu cầu kết bạn
router.post('/cancel-request/:userId',authenticateUser, userController.cancelFriendRequest);
router.post('/cancel-waitaccept/:userId', authenticateUser, userController.cancelWaitAccept);
// Chặn người dùng
router.post('/block-user/:userId',authenticateUser, userController.blockUser);
// Lấy danh sách yêu cầu kết bạn
router.get('/requested', authenticateUser, userController.getRequestedFriends);
// Lấy danh sách gợi ý kết bạn
router.get('/suggested', authenticateUser, userController.getSuggestedFriends);
// Lấy danh sách lời mời kết bạn
router.get('/waitaccept', authenticateUser, userController.getWaitAcceptFriends);
// Lấy danh sách bạn bè
router.get('/friends', authenticateUser, userController.getFriends);
router.get('/profile',authenticateUser,userController.getUserByToken);
module.exports = router;