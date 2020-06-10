from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User


class AuthViewsTests(APITestCase):

    def setUp(self):
        self.username = 'test'
        self.password = '00000'
        self.data = {
            'username': self.username,
            'password': self.password
        }

    def test_current_user(self):

        # URL using path name
        url = reverse('users')

        # Create a user is a workaround in order to authentication works
        user = User.objects.create_user(username='usuario', email='usuario@mail.com', password='contrasegna')
        self.assertEqual(user.is_active, 1, 'Active User')

        # First post to get token
        response = self.client.post(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)
        token = response.data['token']

        # Next post/get's will require the token to connect
        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('current_user'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
