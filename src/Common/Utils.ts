/* istanbul ignore file */

const UTF8Decoder = new TextDecoder();

export const CloneAsJSON: (obj: any) => any = (obj: any) => {
    if (obj && obj.toJSON)
        obj = obj.toJSON();

    if (Object(obj) !== obj) {
        return obj;
    } else if (Array.isArray(obj)) {
        return obj.filter(
            v => !IsEmpty(v)
        ).map(CloneAsJSON);
    } else if (obj instanceof Map) {
        return Object.fromEntries([...obj].filter(
            ([k, v]) => !IsEmpty(v)
        ).map(
            ([k, v]) => ([k, CloneAsJSON(v)])
        ));
    }  else if (obj instanceof Set) {
        return [...obj].filter(
            v => !IsEmpty(v)
        ).map(CloneAsJSON);
    } else {
        return Object.fromEntries(Object.entries(obj).filter(
            ([k, v]) => !IsEmpty(v)
        ).map(
            ([k, v]) => ([k, CloneAsJSON(v)])
        ));
    }
}

export const IsEmpty: (obj: any) => boolean = (obj: any) => {
    if (Object(obj) !== obj) {
        return false;
    } else if (Array.isArray(obj)) {
        return obj.length == 0;
    } else if (obj instanceof Map) {
        return obj.size == 0;
    } else if (obj instanceof Set) {
        return obj.size == 0;
    }else {
        return Object.entries(obj).length == 0;
    }
}

export const IsDecodable: (obj: any) => boolean = (obj: any) => {
    return Boolean(obj && (typeof obj === 'object') && (Array.isArray(obj) || (ArrayBuffer.isView(obj) && !(obj instanceof DataView))));
}

export const TryDecode: (obj: any) => { value: string, error: boolean } = (obj: any) => {
    if(typeof obj === 'string') {
        return { value: <string>obj, error: false };
    } else if (!IsDecodable(obj)) {
        return { value: '', error: true };
    }

    try {
        return { value: UTF8Decoder.decode(obj), error: false };
    } catch {
        return { value: '', error: true };
    }
}

/*
June 1st 2021
Method will generate the equivalent of Twitter Snowflake
@ https://github.com/twitter-archive/snowflake/tree/b3f6a3c6ca8e1b6847baa6ff42bf72201e2c2231

This is inteded to mimic de ElasticSearch ID generation 
@ https://github.com/elastic/elasticsearch/blob/99f88f15c5febbca2d13b5b5fda27b844153bf1a/server/src/main/java/org/elasticsearch/common/TimeBasedUUIDGenerator.java#L80-L118

Since ES uses MACAddress and that is not available it will instead rely on external information 
- like keeping a random ID generated during initial setup

Code is a rewrite of s-yadav/FlakeId @ https://github.com/s-yadav/FlakeId
MIT License

The rewrite relies on ES2016 built-in JS BigInt instead of hex2dec by Dan Vanderkam http://www.danvk.org/hex2dec.html
*/
export class FlakeId {
    private _seq: number;
    private _mid: number;
    private _timeOffset: number;
    private _lastTime: number;

    constructor(lastTime?: number, mid?: number, seq?: number, timeOffset?: number) {
        this._seq = seq || 0;
        this._mid = (mid || 1) % 1023;
        this._timeOffset = timeOffset || 0;
        this._lastTime = lastTime || 0;
    }

    get lastTime(): number {
        return this._lastTime;
    }

    generate(): string {
        const time: number = Date.now();
        const bTime = time - this._timeOffset;

        //get the sequence number
        if (this._lastTime == time) {
            this._seq++;

            if (this._seq > 4095) {
                this._seq = 0;

                //make system wait till time is been shifted by one millisecond
                while (Date.now() <= time) { }
            }
        } else {
            this._seq = 0;
        }

        this._lastTime = time;
        let idStart = BigInt(bTime) * (BigInt(2) ** BigInt(22));
        let idMid = BigInt(this._mid) * (BigInt(2) ** BigInt(12));
        let idEnd = BigInt(this._seq);

        return (idStart + idMid + idEnd).toString(16);
    }
}