const { User } = require('../../utils/schemas');

async function manageUsers(cli) {
  while (true) {
    console.clear();
    console.log('👥 Manage Users');
    console.log('══════════════════');
    console.log('1. List Users');
    console.log('2. Add User');
    console.log('3. Update User');
    console.log('4. Delete User');
    console.log('5. Back to Main Menu');
    console.log();

    const choice = await cli.question('Select an option: ');

    switch (choice.trim()) {
      case '1':
        await listUsers(cli);
        break;
      case '2':
        await addUser(cli);
        break;
      case '3':
        await updateUser(cli);
        break;
      case '4':
        await deleteUser(cli);
        break;
      case '5':
        return;
      default:
        console.log('❌ Invalid option. Please try again.');
        await cli.question('Press Enter to continue...');
    }
  }
}

async function listUsers(cli) {
  console.log('\n--- Listing Users ---');
  const users = await User.find();
  if (users.length === 0) {
    console.log('No users found.');
  } else {
    users.forEach(user => {
      console.log(`ID: ${user._id} | Email: ${user.email} | Name: ${user.firstName || ''} ${user.lastName || ''} | Nickname: ${user.nickName || 'N/A'}`);
    });
  }
  await cli.question('\nPress Enter to continue...');
}

async function addUser(cli) {
  console.log('\n--- Adding a new User ---');
  const email = await cli.question('Enter user email: ');
  if (!email) {
    console.log('❌ User email is required.');
    await cli.question('\nPress Enter to continue...');
    return;
  }

  const firstName = await cli.question('Enter first name (optional): ');
  const lastName = await cli.question('Enter last name (optional): ');
  const nickName = await cli.question('Enter nickname (optional): ');
  const phone = await cli.question('Enter phone number (optional): ');

  try {
    const newUser = new User({ email, firstName, lastName, nickName, phone });
    await newUser.save();
    console.log('✅ User added successfully!');
  } catch (error) {
    console.error('❌ Error adding user:', error.message);
  }
  await cli.question('\nPress Enter to continue...');
}

async function updateUser(cli) {
    console.log('\n--- Updating a User ---');
    const email = await cli.question('Enter the email of the user to update: ');
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log('❌ User not found.');
        await cli.question('\nPress Enter to continue...');
        return;
      }
  
      const firstName = await cli.question(`Enter new first name (current: ${user.firstName}): `);
      const lastName = await cli.question(`Enter new last name (current: ${user.lastName}): `);
      const nickName = await cli.question(`Enter new nickname (current: ${user.nickName}): `);
      const phone = await cli.question(`Enter new phone number (current: ${user.phone}): `);
  
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.nickName = nickName || user.nickName;
      user.phone = phone || user.phone;
  
      await user.save();
      console.log('✅ User updated successfully!');
    } catch (error) {
      console.error('❌ Error updating user:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}
  
async function deleteUser(cli) {
    console.log('\n--- Deleting a User ---');
    const email = await cli.question('Enter the email of the user to delete: ');
  
    try {
      const result = await User.findOneAndDelete({ email });
      if (result) {
        console.log('✅ User deleted successfully!');
      } else {
        console.log('❌ User not found.');
      }
    } catch (error) {
      console.error('❌ Error deleting user:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}

module.exports = manageUsers;
