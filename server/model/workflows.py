from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import time
from bson.objectid import ObjectId
from bson.errors import InvalidId
import os
import xml.etree.ElementTree as ET
import secrets
import string
from dotenv import load_dotenv
load_dotenv()

class WorkFlowModel:
    def __init__(self) -> None:
        self.collection = MongoClient(os.getenv('MongoURL'))[
            os.getenv('dbName')][os.getenv('tableName')]
        self.collection.create_index('serverID', unique=True)

    def get_random_string(self, length):
        letters = string.ascii_letters+string.digits
        return ''.join(secrets.choice(letters) for i in range(length))

    def insert(self, graphml, latestHash):
        while(True):
            serverID = self.get_random_string(6)
            try:
                self.collection.insert_one(
                    {'graphml': graphml, 'latestHash': latestHash, 'serverID': serverID})
                return serverID
            except DuplicateKeyError:
                continue

    def get(self, serverID):
        cl = self.collection.find_one({'serverID': serverID})
        if not cl:
            return None
        return cl['graphml']

    def update(self, serverID, graphml, latestHash, allHash):
        existingRecord = self.collection.find_one_and_update(
            {'serverID': serverID, 'latestHash': {'$in': allHash}},
            {"$set": {'graphml': graphml, 'latestHash': latestHash}})
        if existingRecord is None:
            if not self.collection.find_one({'serverID': serverID}):
                return False, 'serverID do not exists.'
            return False, 'Can not update as provided graph do not has latest changes.'
        return True, latestHash

    def forceUpdate(self, serverID, graphml, latestHash):
        existingRecord = self.collection.find_one_and_update(
            {'serverID': serverID},
            {"$set": {'graphml': graphml, 'latestHash': latestHash}})
        if existingRecord is None:
            return False, 'serverID do not exists.'
        return True, latestHash
