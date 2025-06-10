const { WebUIUser, Organization } = require('../../utils/schemas');
const bcrypt = require('bcrypt');

async function manageWebUIUsers(cli) {
  while (true) {
    console.clear();
    console.log('👤 Manage WebUI Users');
    console.log('══════════════════════');
    console.log('1. List WebUI Users');
    console.log('2. Add WebUI User');
    console.log('3. Update WebUI User');
    console.log('4. Delete WebUI User');
    console.log('5. Back to Main Menu');
    console.log();

    const choice = await cli.question('Select an option: ');

    switch (choice.trim()) {
      case '1':
        await listWebUIUsers(cli);
        break;
      case '2':
        await addWebUIUser(cli);
        break;
      case '3':
        await updateWebUIUser(cli);
        break;
      case '4':
        await deleteWebUIUser(cli);
        break;
      case '5':
        return;
      default:
        console.log('❌ Invalid option. Please try again.');
        await cli.question('Press Enter to continue...');
    }
  }
}

async function listWebUIUsers(cli) {
  console.log('\n--- Listing WebUI Users ---');
  const users = await WebUIUser.find().populate('organizationId');
  if (users.length === 0) {
    console.log('No WebUI users found.');
  } else {
    users.forEach(user => {
      console.log(`ID: ${user._id} | Email: ${user.email} | Organization: ${user.organizationId ? user.organizationId.name : 'N/A'}`);
    });
  }
  await cli.question('\nPress Enter to continue...');
}

async function addWebUIUser(cli) {
  console.log('\n--- Adding a new WebUI User ---');
  const email = await cli.question('Enter user email: ');
  const password = await cli.question('Enter password: ');
  const organizationId = await cli.question('Enter organization ID: ');

  if (!email || !password || !organizationId) {
    console.log('❌ Email, password, and organization ID are required.');
    await cli.question('\nPress Enter to continue...');
    return;
  }

  try {
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      console.log('❌ Organization not found.');
      await cli.question('\nPress Enter to continue...');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new WebUIUser({ email, password: hashedPassword, organizationId });
    await newUser.save();
    console.log('✅ WebUI User added successfully!');
  } catch (error) {
    console.error('❌ Error adding WebUI user:', error.message);
  }
  await cli.question('\nPress Enter to continue...');
}

async function updateWebUIUser(cli) {
    console.log('\n--- Updating a WebUI User ---');
    const email = await cli.question('Enter the email of the user to update: ');
  
    try {
      const user = await WebUIUser.findOne({ email });
      if (!user) {
        console.log('❌ User not found.');
        await cli.question('\nPress Enter to continue...');
        return;
      }
  
      const newPassword = await cli.question('Enter new password (leave blank to keep current): ');
      if (newPassword) {
        user.password = await bcrypt.hash(newPassword, 10);
      }
  
      await user.save();
      console.log('✅ WebUI User updated successfully!');
    } catch (error) {
      console.error('❌ Error updating WebUI user:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}
  
async function deleteWebUIUser(cli) {
    console.log('\n--- Deleting a WebUI User ---');
    const email = await cli.question('Enter the email of the user to delete: ');
  
    try {
      const result = await WebUIUser.findOneAndDelete({ email });
      if (result) {
        console.log('✅ WebUI User deleted successfully!');
      } else {
        console.log('❌ User not found.');
      }
    } catch (error) {
      console.error('❌ Error deleting WebUI user:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}

module.exports = manageWebUIUsers;
