export class PageRevision {

    constructor(public id: number, public timestamp: number, public user?: string, 
        public comment?: string, public parentId?: number, public minor?: string,
        public anon?: string) {}

    /**
     * Helper method for creating a new PageRevision with `revData`
     * @param revData 
     */
    static fromObject(revData: any): PageRevision {
        if (!revData || !revData.revid || !revData.timestamp) {
            return null;
        }

        return new PageRevision(revData.revid, revData.timestamp, revData.user, revData.comment, revData.parentid, revData.minor, revData.anon);
    }

    /**
     * Helper method for overwriting this PageRevision with `revData`
     * @param revData 
     */
    public fromObject(revData: any): PageRevision {
        this.id = revData.revid || this.id;
        this.timestamp = revData.timestamp || this.timestamp;
        this.user = revData.user || this.user;
        this.comment = revData.comment || this.comment;
        this.parentId = revData.parentId || this.parentId;
        this.minor = revData.minor || this.minor;
        this.anon = revData.anon || this.anon;

        return this;
    }
}
