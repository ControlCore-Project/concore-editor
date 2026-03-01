import importlib
import pathlib
import sys
import types
import unittest

from flask import Flask

VALID_GRAPHML = (
    '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">'
    '<graph edgedefault="directed">'
    '<actionHistory><hash>hash-1</hash></actionHistory>'
    '</graph>'
    '</graphml>'
)


class FakeWorkFlowModel:
    def __init__(self, graph_response):
        self.graph_response = graph_response

    def get(self, _server_id):
        return self.graph_response


class WorkflowControllerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        server_root = pathlib.Path(__file__).resolve().parents[1]
        if str(server_root) not in sys.path:
            sys.path.insert(0, str(server_root))

        fake_model_pkg = types.ModuleType('model')
        fake_model_workflows = types.ModuleType('model.workflows')

        class StubWorkFlowModel:
            def get(self, _server_id):
                return None

        fake_model_workflows.WorkFlowModel = StubWorkFlowModel
        fake_model_pkg.workflows = fake_model_workflows

        sys.modules['model'] = fake_model_pkg
        sys.modules['model.workflows'] = fake_model_workflows

        if 'controller.workflow' in sys.modules:
            del sys.modules['controller.workflow']
        cls.workflow_module = importlib.import_module('controller.workflow')

    def make_client(self, graph_response):
        self.workflow_module.workFlowModel = FakeWorkFlowModel(graph_response)
        app = Flask(__name__)
        app.register_blueprint(self.workflow_module.workFlow, url_prefix='/workflow')
        return app.test_client()

    def test_missing_workflow_returns_404_for_none(self):
        client = self.make_client(None)
        response = client.get('/workflow/missing-id')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_data(as_text=True), 'Not Found')

    def test_missing_workflow_returns_404_for_legacy_tuple(self):
        client = self.make_client((False, 'Record Not Found'))
        response = client.get('/workflow/missing-id')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_data(as_text=True), 'Not Found')

    def test_hash_header_returns_400_for_different_history(self):
        client = self.make_client(VALID_GRAPHML)
        response = client.get('/workflow/existing-id', headers={'X-Latest-Hash': 'unknown-hash'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_data(as_text=True), 'Different History')

    def test_hash_header_returns_200_for_matching_history(self):
        client = self.make_client(VALID_GRAPHML)
        response = client.get('/workflow/existing-id', headers={'X-Latest-Hash': 'hash-1'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_data(as_text=True), VALID_GRAPHML)


if __name__ == '__main__':
    unittest.main()
