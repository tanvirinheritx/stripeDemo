var express = require('express');
var router = express.Router();

const {
  register,
  login,
  addCard,
  charge,
  refund,
  updateUser,
  getAllUsers,
  deleteUser,
  planList,
  subscription
} = require('../controllers/user.contrller')

router.post('/register', register)
router.post('/login', login)
router.post('/addCard', addCard)
router.post('/charge',charge)
router.post('/refund', refund)
router.put('/updateUser', updateUser)
router.delete('/deleteUser',deleteUser)
router.get('/allUsers', getAllUsers )
router.get('/planList', planList )
router.post('/subscription',subscription)
 
module.exports = router;


