import User from '../model/Users.js';

const registerUserInHospital = async (req, res) => {
  try {
    const { userId, email, name, surname, height, weight, age, gender, bloodGroup, allergies } = req.body;
    
    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: 'User ID and email are required'
      });
    }
    
    let user = await User.findById(userId);
    
    if (user) {
      user.name = name || user.name || '';
      user.surname = surname || user.surname || '';
      user.height = height || user.height || null;
      user.weight = weight || user.weight || null;
      user.age = age || user.age || null;
      user.gender = gender || user.gender || 'prefer-not-to-say';
      user.bloodGroup = bloodGroup || user.bloodGroup || '';
      user.allergies = allergies || user.allergies || '';
      await user.save();
    } else {
      user = new User({
        _id: userId,
        email: email,
        name: name || '',
        surname: surname || '',
        height: height || null,
        weight: weight || null,
        age: age || null,
        gender: gender || 'prefer-not-to-say',
        bloodGroup: bloodGroup || '',
        allergies: allergies || '',
        authServiceId: userId,
        isActive: true
      });
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'Patient profile saved successfully',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name || '',
        surname: user.surname || '',
        gender: user.gender || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        bloodGroup: user.bloodGroup || '',
        allergies: user.allergies || ''
      }
    });
  } catch (err) {
    console.error('Register user in hospital error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    let user = await User.findById(req.userId);
    
    if (!user) {
      user = new User({
        _id: req.userId,
        email: req.userEmail || '',
        name: '',
        surname: '',
        authServiceId: req.userId,
        isActive: true
      });
      await user.save();
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name || '',
        surname: user.surname || '',
        gender: user.gender || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        bloodGroup: user.bloodGroup || '',
        allergies: user.allergies || '',
        appointments: user.appointments || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const allowedUpdates = ['name', 'surname', 'height', 'weight', 'age', 'gender', 'bloodGroup', 'allergies'];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name || '',
        surname: user.surname || '',
        gender: user.gender || '',
        age: user.age || '',
        height: user.height || '',
        weight: user.weight || '',
        bloodGroup: user.bloodGroup || '',
        allergies: user.allergies || '',
        appointments: user.appointments || []
      }
    });
  } catch (err) {
    console.error('Update user profile error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  registerUserInHospital,
  getUserProfile,
  updateUserProfile
};