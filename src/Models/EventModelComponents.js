class User {
    constructor(id, username) {
        this.id = id || ''
        this.username = username || ''
    }
}

class Sender extends User { }
class Receiver extends User { }
class Moderator extends User { }
class Target extends User { }

class Item {
    constructor(data = {}) {
        this.type = data.item.type || ''
        this.amount = data.item.amount || 0
    }
}

class Action {
    constructor(data = {}) {
        this.type = data.moderationType || ''
        this.duration = data.duration || null
    }
}

class Conversation {
    constructor(data = {}) {
        this.id = data.conversation_id || ""
        this.is_new_conversation = data.is_new_conversation
    }
}

class RoomMetadata {
    constructor(data = {}) {
        this.owner_id = data.room_info.owner_id || ''
        this.room_name = data.room_info.room_name || ''
    }
}

class ConnectionMetadata {
    constructor(data = {}) {
        this.id = data.connection_id || ''
        this.rate_limits = data.rate_limits || { client: [], socials: [] }
    }
}

module.exports = {
    User,
    Item,
    Sender,
    Target,
    Action,
    Receiver,
    Moderator,
    Conversation,
    RoomMetadata,
    ConnectionMetadata,
}