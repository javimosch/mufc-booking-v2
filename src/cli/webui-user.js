const { WebUIUser, Organization } = require('../../utils/schemas');
const bcrypt = require('bcrypt');

async function manageWebUIUsers(cli) {
  while (true) {
    console.clear();
    console.log('👥 Manage WebUI Users');
    console.log('══════════════════');
    console.log('1. List WebUI Users');
    console.log('2. Add WebUI User');
    console.log('3. Update WebUI User');
    console.log('4. Delete WebUI User');
    console.log('5. Promote User to Org Admin');
    console.log('6. Back to Main Menu');
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
        await promoteUserToOrgAdmin(cli);
        break;
      case '6':
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
      console.log(`ID: ${user._id} | Email: ${user.email} | Role: ${user.role} | Organization: ${user.organizationId ? user.organizationId.name : 'N/A'}`);
    });
  }
  await cli.question('\nPress Enter to continue...');
}

async function addWebUIUser(cli) {
  console.log('\n--- Adding a new WebUI User ---');
  const email = await cli.question('Enter user email: ');
  if (!email) {
    console.log('❌ User email is required.');
    await cli.question('\nPress Enter to continue...');
    return;
  }

  const password = await cli.question('Enter password: ');
  if (!password) {
    console.log('❌ Password is required.');
    await cli.question('\nPress Enter to continue...');
    return;
  }

  const role = await cli.question('Enter role (user/orgAdmin/superAdmin, default: user): ') || 'user';
  if (!['user', 'orgAdmin', 'superAdmin'].includes(role)) {
    console.log('❌ Invalid role. Must be \'user\', \'orgAdmin\', or \'superAdmin\'.');
    await cli.question('\nPress Enter to continue...');
    return;
  }

  let organizationId;
  
  // For orgAdmin and user roles, require organization assignment
  if (role === 'orgAdmin' || role === 'user') {
    const organizations = await Organization.find();
    if (organizations.length === 0) {
      console.log('❌ No organizations found. Please create an organization first.');
      await cli.question('\nPress Enter to continue...');
      return;
    }

    console.log('Available Organizations:');
    organizations.forEach((org, index) => {
      console.log(`${index + 1}. ${org.name} (ID: ${org._id})`);
    });

    const orgChoice = await cli.question('Select organization by number or ID: ');

    if (!isNaN(orgChoice) && parseInt(orgChoice) > 0 && parseInt(orgChoice) <= organizations.length) {
      organizationId = organizations[parseInt(orgChoice) - 1]._id;
    } else {
      organizationId = orgChoice;
    }
  } else {
    // SuperAdmin doesn't need organization assignment
    organizationId = await Organization.findOne().then(org => org ? org._id : null);
    if (!organizationId) {
      console.log('❌ No organizations found. Please create an organization first.');
      await cli.question('\nPress Enter to continue...');
      return;
    }
  }

  try {
    const newWebUIUser = new WebUIUser({ email, password, role, organizationId });
    await newWebUIUser.save();
    console.log('✅ WebUI User added successfully!');
  } catch (error) {
    console.error('❌ Error adding WebUI user:', error.message);
  }
  await cli.question('\nPress Enter to continue...');
}

async function updateWebUIUser(cli) {
    console.log('\n--- Updating a WebUI User ---');
    const email = await cli.question('Enter the email of the WebUI user to update: ');
  
    try {
      const user = await WebUIUser.findOne({ email });
      if (!user) {
        console.log('❌ WebUI User not found.');
        await cli.question('\nPress Enter to continue...');
        return;
      }
  
      const newEmail = await cli.question(`Enter new email (current: ${user.email}): `);
      const newPassword = await cli.question('Enter new password (leave blank to keep current): ');
      const newRole = await cli.question(`Enter new role (user/orgAdmin/superAdmin, current: ${user.role}, leave blank to keep current): `);

      if (newEmail) user.email = newEmail;
      if (newPassword) user.password = newPassword; // Pre-save hook will hash it
      if (newRole) {
        if (!['user', 'orgAdmin', 'superAdmin'].includes(newRole)) {
          console.log('❌ Invalid role. Must be \'user\', \'orgAdmin\', or \'superAdmin\'.');
          await cli.question('\nPress Enter to continue...');
          return;
        }
        user.role = newRole;
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
    const email = await cli.question('Enter the email of the WebUI user to delete: ');
  
    try {
      const result = await WebUIUser.findOneAndDelete({ email });
      if (result) {
        console.log('✅ WebUI User deleted successfully!');
      } else {
        console.log('❌ WebUI User not found.');
      }
    } catch (error) {
      console.error('❌ Error deleting WebUI user:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}

async function promoteUserToOrgAdmin(cli) {
  console.log('\n--- Promote User to Organization Admin ---');
  const email = await cli.question('Enter the email of the user to promote: ');

  try {
    const user = await WebUIUser.findOne({ email });
    if (!user) {
      console.log('❌ User not found.');
      await cli.question('\nPress Enter to continue...');
      return;
    }

    if (user.role === 'orgAdmin') {
      console.log('ℹ️ User is already an organization admin.');
      await cli.question('\nPress Enter to continue...');
      return;
    }

    if (user.role === 'superAdmin') {
      console.log('ℹ️ Cannot change role of a super admin.');
      await cli.question('\nPress Enter to continue...');
      return;
    }

    const organizations = await Organization.find();
    if (organizations.length === 0) {
      console.log('❌ No organizations found. Please create an organization first.');
      await cli.question('\nPress Enter to continue...');
      return;
    }

    console.log('Available Organizations:');
    organizations.forEach((org, index) => {
      console.log(`${index + 1}. ${org.name} (ID: ${org._id})`);
    });

    const orgChoice = await cli.question('Select organization by number or ID: ');
    let organizationId;

    if (!isNaN(orgChoice) && parseInt(orgChoice) > 0 && parseInt(orgChoice) <= organizations.length) {
      organizationId = organizations[parseInt(orgChoice) - 1]._id;
    } else {
      organizationId = orgChoice;
    }

    user.role = 'orgAdmin';
    user.organizationId = organizationId;
    await user.save();

    console.log('✅ User promoted to organization admin successfully!');
  } catch (error) {
    console.error('❌ Error promoting user:', error.message);
  }
  await cli.question('\nPress Enter to continue...');
}

module.exports = manageWebUIUsers;