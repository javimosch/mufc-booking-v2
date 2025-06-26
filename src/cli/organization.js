const { Organization, WebUIUser, MatchEvent, PassedMatchEvent } = require('../../utils/schemas');

async function manageOrganizations(cli) {
  while (true) {
    console.clear();
    console.log('🏢 Manage Organizations');
    console.log('══════════════════════');
    console.log('1. List Organizations');
    console.log('2. Add Organization');
    console.log('3. Update Organization');
    console.log('4. Delete Organization');
    console.log('5. Back to Main Menu');
    console.log();

    const choice = await cli.question('Select an option: ');

    switch (choice.trim()) {
      case '1':
        await listOrganizations(cli);
        break;
      case '2':
        await addOrganization(cli);
        break;
      case '3':
        await updateOrganization(cli);
        break;
      case '4':
        await deleteOrganization(cli);
        break;
      case '5':
        return;
      default:
        console.log('❌ Invalid option. Please try again.');
        await cli.question('Press Enter to continue...');
    }
  }
}

async function listOrganizations(cli) {
  console.log('\n--- Listing Organizations ---');
  const organizations = await Organization.find();
  if (organizations.length === 0) {
    console.log('No organizations found.');
  } else {
    organizations.forEach(org => {
      console.log(`ID: ${org._id} | Name: ${org.name} | Description: ${org.description || 'N/A'}`);
    });
  }
  await cli.question('\nPress Enter to continue...');
}

async function addOrganization(cli) {
  console.log('\n--- Adding a new Organization ---');
  const name = await cli.question('Enter organization name: ');
  const description = await cli.question('Enter organization description (optional): ');

  if (!name) {
    console.log('❌ Organization name is required.');
    await cli.question('\nPress Enter to continue...');
    return;
  }

  try {
    const newOrg = new Organization({ name, description });
    await newOrg.save();
    console.log('✅ Organization added successfully!');
  } catch (error) {
    console.error('❌ Error adding organization:', error.message);
  }
  await cli.question('\nPress Enter to continue...');
}

async function updateOrganization(cli) {
    console.log('\n--- Updating an Organization ---');
    const id = await cli.question('Enter the ID of the organization to update: ');
  
    try {
      const org = await Organization.findById(id);
      if (!org) {
        console.log('❌ Organization not found.');
        await cli.question('\nPress Enter to continue...');
        return;
      }
  
      const name = await cli.question(`Enter new name (current: ${org.name}): `);
      const description = await cli.question(`Enter new description (current: ${org.description}): `);
  
      org.name = name || org.name;
      org.description = description || org.description;
  
      await org.save();
      console.log('✅ Organization updated successfully!');
    } catch (error) {
      console.error('❌ Error updating organization:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
  }
  
  async function deleteOrganization(cli) {
    console.log('\n--- Deleting an Organization ---');
    const id = await cli.question('Enter the ID of the organization to delete: ');
  
    try {
      const organization = await Organization.findById(id);
      if (!organization) {
        console.log('❌ Organization not found.');
        await cli.question('\nPress Enter to continue...');
        return;
      }

      // Delete associated WebUIUsers
      await WebUIUser.deleteMany({ organizationId: id });
      console.log('✅ Associated WebUI Users deleted.');

      // Delete associated MatchEvents
      await MatchEvent.deleteMany({ organizationId: id });
      console.log('✅ Associated Match Events deleted.');

      // Delete associated PassedMatchEvents
      await PassedMatchEvent.deleteMany({ organizationId: id });
      console.log('✅ Associated Passed Match Events deleted.');

      await organization.deleteOne();
      console.log('✅ Organization deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting organization:', error.message);
    n    await cli.question('\nPress Enter to continue...');
  }

module.exports = manageOrganizations;
