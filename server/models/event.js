


class Event{
    constructor(id,title,description,startdate,enddate,location,recurrence,agentId,groupId,sectorId){
        this.id = id;
        this.title = title;
        this.description = description;
        this.startdate = startdate;
        this.enddate = enddate;
        this.location = location;
        this.recurrence = recurrence;
        this.agentId = agentId;
        this.groupId = groupId;
        this.sectorId = sectorId;
    }
}


module.exports = Event;