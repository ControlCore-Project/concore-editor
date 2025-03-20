from model.workflows import *
from flask import request, make_response, Blueprint
import defusedxml.ElementTree as ET

workFlow = Blueprint('workflow', __name__)
workFlowModel = WorkFlowModel()


def getLasteshActionHash(root):
    xmlns = root.tag[root.tag.index('{')+1:root.tag.rindex('}')]
    return root.find(f'{{{xmlns}}}graph')\
        .findall(f'{{{xmlns}}}actionHistory')[-1]\
        .find(f'{{{xmlns}}}hash')\
        .text


def getAllActionHash(root):
    xmlns = root.tag[root.tag.index('{')+1:root.tag.rindex('}')]
    return list(map(lambda ah: ah.find(f'{{{xmlns}}}hash').text, root.find(f'{{{xmlns}}}graph').findall(f'{{{xmlns}}}actionHistory')))


@workFlow.route("/", methods=['POST'])
def postWorkflow():
    try:
        lastestHash = getLasteshActionHash(ET.fromstring(request.data))
    except:
        return "Invalid GraphML", 400
    graphML = request.data.decode('utf')
    return workFlowModel.insert(graphML, lastestHash)


@workFlow.route("/<serverID>")
def getWorkflow(serverID):
    graphml = workFlowModel.get(serverID)
    if graphml is None:
        return "Not Found", 404
    if('X-Latest-Hash' in request.headers):
        latestHash = request.headers['X-Latest-Hash']
        allHash = getAllActionHash(ET.fromstring(graphml))
        if(latestHash not in allHash):
            return 'Different History', 400
    r = make_response(graphml)
    r.headers.set('Content-Type', "application/xml")
    return r


@workFlow.route("/<serverID>", methods=['POST'])
def updateWorkflow(serverID):
    forceUpdate = request.args.get(
        'force') and request.args.get('force').lower() == 'true'
    try:
        root = ET.fromstring(request.data)
        latestHash = getLasteshActionHash(root)
        if(not forceUpdate):
            allHash = getAllActionHash(root)
    except:
        return "Invalid GraphML", 400
    graphML = request.data.decode('utf')
    if(forceUpdate):
        res = workFlowModel.forceUpdate(serverID, graphML, latestHash)
    else:
        res = workFlowModel.update(serverID, graphML, latestHash, allHash)
    return res[1], 200 if res[0] else 400
