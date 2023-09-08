export default class BaseEntity
{
    protected modelName:any

    constructor(modelname){
        this.modelName=modelname;}
        
    async findOne(condition)
    {
        return await this.modelName.findOne({where:condition})
    }
    async findAll()
    {
        return await this.modelName.findAll()
    }
    async findAllwithAttrib(condition)
    {
        return await this.modelName.findAll(condition)
    }
    async findAllcondition(condition)
    {
        return await this.modelName.findAll({where:condition})
    }
    async create(payload)
    {
        return await this.modelName.create(payload)
    }
    async destroy(dataToDelete)
    {
        return await dataToDelete.destroy();
    }
    async update(payload,condition)
    {
        return await this.modelName.update(payload,{where:condition});
    }
}