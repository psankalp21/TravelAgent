import Session from "../database/models/session.model";

export async function create_session(key, agent_id, ip_addr) {
        const now = new Date();
        now.setDate(now.getDate() + 1)
        const session = await Session.create({
            id: key,
            user_id: agent_id,
            ip_addr: ip_addr,
            active: 'active',
            expiry: now
        });
        return session;

}

export async function inactive_session(id) {
        const session = await Session.findByPk(id);
        session.active = 'not active';
        session.save();
        return session;
}


export async function update_session(id) {
        const session = await Session.findByPk(id);
        const now = new Date();
        now.setDate(now.getDate() + 1)
        session.active = 'active';
        session.expiry = now;
        session.save();
        return session;
}

export async function is_session_active(id) {
        const now = new Date();
        const session = await Session.findByPk(id);
        if (session) {
            if (session.active == 'active' && now < session.expiry)
                return 1
            else if (session.active == 'active' && now >= session.expiry)
                return 2
            else if (session.active == 'false')
                return 3
        }
        else
            return 0
}