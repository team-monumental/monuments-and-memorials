export const Role = {
    COLLABORATOR: 'COLLABORATOR',
    PARTNER: 'PARTNER',
    RESEARCHER: 'RESEARCHER',
    ADMIN: 'ADMIN',
    get PARTNER_OR_ABOVE() {
        return [this.PARTNER, this.RESEARCHER, this.ADMIN]
    },
    get RESEARCHER_OR_ABOVE() {
        return [this.RESEARCHER, this.ADMIN];
    }
};
