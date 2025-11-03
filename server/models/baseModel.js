


class BaseModel {
    constructor(fields = {},requiredFields=[],lengthLimits= {}) {
        const now = new Date;
        const requireField = (value,name) => {
            if (value === null|| value === undefined){
                throw new Error(`${name} cannot be null or undefined`);
            }
        }

        const validateLength = (value,name,minLength = 0,maxLength = Infinity)=>{
            if(value!=null&&value!=undefined){
                if(value.length > maxLength){
                    throw new Error(`${name} cannot be over ${maxLength} characters`);
                }
                if(value.length < minLength){
                    throw new Error(`${name} cannot be lower than ${minLength} characters`);
                }
            }
        }

        requiredFields.forEach(field => requireField(fields[field], field));

        Object.entries(lengthLimits).forEach(([field,limits])=>{
            const minLength = limits.min || 0;
            const maxLength = limits.max || Infinity;
            validateLength(fields[field],field,minLength,maxLength)

        });

        this.updated_at = fields.updated_at || now;
        this.created_at = fields.created_at || now;
    }

    toJSON(){
        return({
            updated_at:this.updated_at,
            created_at:this.created_at
        })
    }
}

module.exports = BaseModel;