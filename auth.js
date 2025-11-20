const express = require('express');
const router = express.Router();

// راوت اللوجين
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // كود التحقق من المستخدم
    res.json({ 
      success: true, 
      message: 'تم الدخول بنجاح',
      user: { email, name: 'Test User' },
      token: 'jwt-token-here'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'البريد أو كلمة المرور غير صحيحة' 
    });
  }
});

module.exports = router;