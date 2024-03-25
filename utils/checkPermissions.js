/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

export const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin') return;
    if (requestUser.userId === resourceUserId.toString()) return;
    return res.send(403).json({ msg: 'you are not allowed to do this' });
  };
  
  export default checkPermissions;