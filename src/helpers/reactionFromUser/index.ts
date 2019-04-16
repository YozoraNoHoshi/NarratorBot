import { Collection, Snowflake, MessageReaction, User } from 'discord.js';

export default function reactionFromUser(
    reactions: Collection<Snowflake, MessageReaction>,
    user: User,
): MessageReaction | void {
    // Reactions is a collection of reactions (duh)
    // Each reaction has a property called users, that is a collection of users that have reacted to the message
    return reactions.find(val => val.users.has(user.id));
    // We want to find the first reaction from the parameter user, and return the specific reaction if the user has reacted.
}
