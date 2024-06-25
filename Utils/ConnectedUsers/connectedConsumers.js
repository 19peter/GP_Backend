class IdMap {
  ////MAP HAS KEY VALUE PAIR:
  /// {
  /// KEY: USER ID FROM DB,
  /// VALUE: socket
  /// }

  constructor() {
    if (!IdMap.instance) {
      this.idMap = new Map();
      IdMap.instance = this;
    }
    return IdMap.instance;
  }

  setCurrentAndSocket(id, socketInfo) {
    if (!this.idMap.has(id)) {
      this.idMap.set(id, socketInfo);
    }
  }

  setCurrentId(id) {
    this.idMap.set(id, null);
  }

  getSocketInfo(id) {
    return this.idMap.get(id);
  }

  deleteConsumer(id) {
    this.idMap.delete(id);
  }
}

const idMapInstance = new IdMap();
Object.freeze(idMapInstance);
module.exports = idMapInstance;
