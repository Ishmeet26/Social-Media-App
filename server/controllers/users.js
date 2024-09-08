import User from "../models/User.js";

//READ
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = User.findById(id);
    req.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.msg })
  }
}

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )

    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath }
    });

    req.status(200).json(formattedFriends);

  } catch (err) {
    res.status(404).json({ message: err.msg })
  }
}

//UPDATE
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    const user = User.findById(id);
    const friend = User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId); //removing friend from user friend list
      friend.friends = friend.friends.filter((id) => id !== id); // removing user from user's friend's list as well.
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();


    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    )

    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath }
    });

    res.status(200).json(formattedFriends);

  } catch (err) {
    res.status(404).json({ message: err.msg })
  }
}