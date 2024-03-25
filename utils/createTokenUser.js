/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

export const createTokenUser = (user) => {
    return { first_name: user.firstName, last_name: user.lastName, email: user.email, phone: user.phoneNumber, userId: user._id, role: user.role, created: user.createdAt };
  };
  
  export default createTokenUser;