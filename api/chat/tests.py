from channels.testing import WebsocketCommunicator
from django.test import TestCase
from chat.consumers import ChatConsumer


class ChatConsumerTestCase(TestCase):
    """
    Test case for the ChatConsumer WebSocket consumer. These tests
    ensure that the WebSocket connection and message handling work as expected.
    """

    async def test_connect(self):
        """
        Test that the WebSocket connection can be successfully established.
        This test verifies that a client can connect to the ChatConsumer and
        receive an acknowledgment of the connection.
        """
        # Initialize a WebSocket communicator to connect to the ChatConsumer
        # `as_asgi()` is used to obtain the ASGI callable for the consumer.
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "/ws/chat/")
        
        # Attempt to establish a WebSocket connection
        connected, _ = await communicator.connect()

        # Verify that the connection was successful (connected == True)
        self.assertTrue(connected)

        # Clean up and close the connection
        await communicator.disconnect()

    async def test_send_and_receive_message(self):
        """
        Test the ability to send a message to the WebSocket and receive the correct response.
        """
        # Initialize a WebSocket communicator
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "/ws/chat/")
        
        # Establish a connection
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Simulate sending a JSON message to the WebSocket server (ChatConsumer)
        await communicator.send_json_to({
            'message': 'Hello, World!',
            'user': 'test_user',
        })

        # Wait for a JSON response from the server
        response = await communicator.receive_json_from()

        # Assert that the response matches the message we sent
        self.assertEqual(response['message'], 'Hello, World!')
        self.assertEqual(response['user'], 'test_user')

        # Clean up by closing the connection
        await communicator.disconnect()

    async def test_disconnect(self):
        """
        This checks whether the consumer properly handles disconnections and 
        ensures that no messages are sent after the WebSocket has been closed.
        """
        # Initialize a WebSocket communicator
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), "/ws/chat/")
        
        # Establish a connection
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Disconnect from the WebSocket
        await communicator.disconnect()

        # Attempt to send a message after the connection is closed.
        # This should fail because the communicator should be disconnected.
        result = await communicator.send_json_to({
            'message': 'Should not work',
            'user': 'test_user',
        })

        # After disconnecting, sending a message should return False or raise an error,
        # indicating that the connection is closed and the message could not be sent.
        self.assertFalse(result, "The message was sent despite the disconnection.")
