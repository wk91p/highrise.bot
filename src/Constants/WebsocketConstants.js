const WebsocketEvents = [
    'SessionMetadata', 'ChatEvent', 'UserMovedEvent', 
    'UserJoinedEvent', 'UserLeftEvent','MessageEvent', 
    'TipReactionEvent', 'RoomModeratedEvent', 'ChannelEvent'
]

const EventToListener = {
    Ready: 'SessionMetadata',
    Chat: 'ChatEvent',
    Movement: 'UserMovedEvent',
    UserJoined: 'UserJoinedEvent',
    UserLeft: 'UserLeftEvent',
    Direct: 'MessageEvent',
    Tip: 'TipReactionEvent',
    Moderation: 'RoomModeratedEvent',
    Channel: 'ChannelEvent'
}

module.exports = {
    WebsocketEvents,
    EventToListener
}