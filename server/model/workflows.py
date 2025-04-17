from pymongo import MongoClient
from pymongo import MongoClient
import time
from bson.objectid import ObjectId
from bson.errors import InvalidId
import os
import xml.etree.ElementTree as ET
import random
import string
from dotenv import load_dotenv
load_dotenv()

class WorkFlowModel:
    def __init__(self) -> None:
        self.collection = MongoClient(os.getenv('MongoURL'))[
            os.getenv('dbName')][os.getenv('tableName')]

    def get_random_string(self, length):
        letters = string.ascii_letters+string.digits
        return ''.join(random.choice(letters) for i in range(length))

    def insert(self, graphml, latestHash):
        serverID = ""
        while(True):
            serverID = self.get_random_string(6)
            if(not self.collection.find_one({'serverID': serverID})):
                break
        self.collection.insert_one(
            {'graphml': graphml, 'latestHash': latestHash, 'serverID': serverID})
        return serverID

    def get(self, serverID):
        cl = self.collection.find_one({'serverID': serverID})
        if not cl:
            return False, 'Record Not Found'
        return cl['graphml']

    def update(self, serverID, graphml, latestHash, allHash):
        existingRecord = self.collection.find_one({'serverID': serverID})
        if existingRecord is None:
            return False, 'serverID do not exists.'
        latestExistingHash = existingRecord['latestHash']
        if latestExistingHash not in allHash:
            return False, 'Can not update as provided graph do not has latest changes.'
        self.collection.update_one({'serverID': serverID}, {
                                   "$set": {'graphml': graphml, 'latestHash': latestHash}})
        return True, latestHash

    def forceUpdate(self, serverID, graphml, latestHash):
        existingRecord = self.collection.find_one({'serverID': serverID})
        if existingRecord is None:
            return False, 'serverID do not exists.'
        self.collection.update_one({'serverID': serverID},
                                   {"$set": {'graphml': graphml, 'latestHash': latestHash}})
        return True, latestHash
