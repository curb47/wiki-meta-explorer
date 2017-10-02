import {PageRevision} from './page-revision';

export class Page {

    constructor(public id: number, public title: string, public language?: string, 
        public languageDir?: string, public lastRevisionId?: number, public length?: number, 
        public revisions?: PageRevision[], public contentModel?: string, public ns?: number,
        public languageHtmlCode?: string, public touched?: string) {}

    /**
     * Helper method for creating a new Page with `pageData`
     * @param revData 
     */
    static fromObject(pageData: any): Page {
        if (!pageData || !pageData.pageid || !pageData.title) {
            return null;
        }

        return new Page(pageData.pageid, pageData.title, pageData.pagelanguage, 
            pageData.pagelanguagedir, pageData.lastrevid, pageData.length, 
            pageData.revisions.map(revData => PageRevision.fromObject(revData)).filter(revision => revision),
            pageData.contentmodel, pageData.ns, pageData.pagelanguagehtmlcode, pageData.touched
        );
    }

    /**
     * Helper method for overwriting this Page with `pageData`
     * @param revData 
     */
    public fromObject(pageData: any): Page {
        this.id = pageData.pageid || this.id;
        this.title = pageData.title || this.title;
        this.language = pageData.pagelanguage || this.language;
        this.languageDir = pageData.pagelanguagedir || this.languageDir;
        this.languageHtmlCode = pageData.pagelanguagehtmlcode || this.languageHtmlCode;
        this.lastRevisionId = pageData.lastrevid || this.lastRevisionId;
        this.length = pageData.length || this.length;
        this.contentModel = pageData.contentmodel || this.contentModel;
        this.ns = pageData.ns || this.ns;
        this.touched = pageData.touched || this.touched;
        this.revisions = pageData.revisions.map(revData => PageRevision.fromObject(revData)).filter(revision => revision)

        return this;
    }
}
