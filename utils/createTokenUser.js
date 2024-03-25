export const createTokenUser = (user) => {
    return { first_name: user.firstName, last_name: user.lastName, email: user.email, phone: user.phoneNumber, userId: user._id, role: user.role, created: user.createdAt };
  };
  
  export default createTokenUser;