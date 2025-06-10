const { MatchEvent, User } = require('../../utils/schemas');

async function manageMatchEvents(cli) {
  while (true) {
    console.clear();
    console.log('📅 Manage Match Events');
    console.log('══════════════════════');
    console.log('1. List Match Events');
    console.log('2. Add Match Event');
    console.log('3. Update Match Event');
    console.log('4. Delete Match Event');
    console.log('5. Join user to event');
    console.log('6. Un-join user from event');
    console.log('7. Back to Main Menu');
    console.log();

    const choice = await cli.question('Select an option: ');

    switch (choice.trim()) {
      case '1':
        await listMatchEvents(cli);
        break;
      case '2':
        await addMatchEvent(cli);
        break;
      case '3':
        await updateMatchEvent(cli);
        break;
      case '4':
        await deleteMatchEvent(cli);
        break;
      case '5':
        await joinUserToEvent(cli);
        break;
      case '6':
        await unjoinUserFromEvent(cli);
        break;
      case '7':
        return;
      default:
        console.log('❌ Invalid option. Please try again.');
        await cli.question('Press Enter to continue...');
    }
  }
}

async function listMatchEvents(cli) {
  console.log('\n--- Listing Match Events ---');
  const events = await MatchEvent.find();
  if (events.length === 0) {
    console.log('No match events found.');
  } else {
    events.forEach(event => {
      console.log(`ID: ${event._id} | Title: ${event.title} | Repeats: ${event.repeatEach}`);
    });
  }
  await cli.question('\nPress Enter to continue...');
}

async function addMatchEvent(cli) {
  console.log('\n--- Adding a new Match Event ---');
  const title = await cli.question('Enter event title: ');
  const repeatEach = await cli.question('Repeat each (none, week, month): ');

  if (!title) {
    console.log('❌ Event title is required.');
    await cli.question('\nPress Enter to continue...');
    return;
  }

  try {
    const newEvent = new MatchEvent({ title, repeatEach });
    await newEvent.save();
    console.log('✅ Match Event added successfully!');
  } catch (error) {
    console.error('❌ Error adding match event:', error.message);
  }
  await cli.question('\nPress Enter to continue...');
}

async function updateMatchEvent(cli) {
    console.log('\n--- Updating a Match Event ---');
    const id = await cli.question('Enter the ID of the event to update: ');
  
    try {
      const event = await MatchEvent.findById(id);
      if (!event) {
        console.log('❌ Match Event not found.');
        await cli.question('\nPress Enter to continue...');
        return;
      }
  
      const title = await cli.question(`Enter new title (current: ${event.title}): `);
      const repeatEach = await cli.question(`Repeat each (current: ${event.repeatEach}): `);
  
      event.title = title || event.title;
      event.repeatEach = repeatEach || event.repeatEach;
  
      await event.save();
      console.log('✅ Match Event updated successfully!');
    } catch (error) {
      console.error('❌ Error updating match event:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}
  
async function deleteMatchEvent(cli) {
    console.log('\n--- Deleting a Match Event ---');
    const id = await cli.question('Enter the ID of the event to delete: ');
  
    try {
      const result = await MatchEvent.findByIdAndDelete(id);
      if (result) {
        console.log('✅ Match Event deleted successfully!');
      } else {
        console.log('❌ Match Event not found.');
      }
    } catch (error) {
      console.error('❌ Error deleting match event:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}

async function joinUserToEvent(cli) {
    console.log('\n--- Joining User to Match Event ---');
    const eventId = await cli.question('Enter the Match Event ID: ');
    const userEmail = await cli.question('Enter the User Email: ');

    try {
        const event = await MatchEvent.findById(eventId);
        if (!event) {
            console.log('❌ Match Event not found.');
            await cli.question('\nPress Enter to continue...');
            return;
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.log('❌ User not found.');
            await cli.question('\nPress Enter to continue...');
            return;
        }

        if (event.subscriptions.some(sub => sub.userId.equals(user._id))) {
            console.log('ℹ️ User is already subscribed to this event.');
            await cli.question('\nPress Enter to continue...');
            return;
        }

        event.subscriptions.push({ userId: user._id, metadata: {} });
        await event.save();
        console.log('✅ User successfully joined to the event!');

    } catch (error) {
        console.error('❌ Error joining user to event:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}

async function unjoinUserFromEvent(cli) {
    console.log('\n--- Un-joining User from Match Event ---');
    const eventId = await cli.question('Enter the Match Event ID: ');
    const userEmail = await cli.question('Enter the User Email: ');

    try {
        const event = await MatchEvent.findById(eventId);
        if (!event) {
            console.log('❌ Match Event not found.');
            await cli.question('\nPress Enter to continue...');
            return;
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.log('❌ User not found.');
            await cli.question('\nPress Enter to continue...');
            return;
        }

        const initialLength = event.subscriptions.length;
        event.subscriptions = event.subscriptions.filter(sub => !sub.userId.equals(user._id));

        if (event.subscriptions.length === initialLength) {
            console.log('ℹ️ User was not subscribed to this event.');
            await cli.question('\nPress Enter to continue...');
            return;
        }

        await event.save();
        console.log('✅ User successfully un-joined from the event!');

    } catch (error) {
        console.error('❌ Error un-joining user from event:', error.message);
    }
    await cli.question('\nPress Enter to continue...');
}

module.exports = manageMatchEvents;
