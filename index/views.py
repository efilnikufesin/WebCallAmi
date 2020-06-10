from django.shortcuts import render

# Create your views here.
import json
from panoramisk import Manager
import os
from django.http import HttpResponse
from panoramisk.call_manager import CallManager
from .models import Test, Contact
from .serializers import TestSerializer, ContactSerializer, UserSerializer, UserSerializerWithToken
from rest_framework import generics
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
import asyncio

class LeadListCreate(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

class ContactListCreate(generics.ListCreateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    def get_queryset(self):
        q = self.request.query_params.get('q')
        full = self.request.query_params.get('view')
        if full:
            queryset = Contact.objects.filter(name=full)
        else:
            queryset = Contact.objects.filter(name__icontains=q)
        return queryset

@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            #return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def session(request):
    if request.method == 'POST':
        js_data = json.loads(request.body.decode())
        cb = js_data['callbackNum']
        request.session['cb_number'] = str(cb)
        return HttpResponse("Your callback number is set: " + str(cb) + str(js_data))

def call(request):
    if request.method == 'POST':
        #digs = request.POST.get('callDigs')
        js_data = json.loads(request.body.decode())
        digs = js_data['callDigs']
        cbnum = request.session['cb_number']
        loop = asyncio.get_event_loop()
        loop.run_until_complete(originate(digs, cbnum))
        return HttpResponse("Called: " + str(digs) + str(cbnum))
    else:
        pass

def answerCall(request):
    if request.method == 'POST':
        js_data = json.loads(request.body.decode())
        channel = js_data['channel']
        cbnum = request.session['cb_number']
        loop = asyncio.get_event_loop()
        loop.run_until_complete(transfer(channel, cbnum))
        return HttpResponse("Called: " + str(channel) + str(cbnum))
    else:
        pass

@asyncio.coroutine
def originate(digs, cbnum):
    ch = str('SIP'+'/'+cbnum+'@806889')
    os.chdir('/home/chief/area/caller/')
    conf_file = 'config'
    callmanager = CallManager.from_config(conf_file)
    yield from callmanager.connect()
    call = yield from callmanager.send_originate({
        'Action': 'Originate',
        'Channel': ch,
        'WaitTime': 20,
        'CallerID': '',
        'Exten': digs,
        'Context': 'city',
        'Priority': 1})
    callmanager.close()


@asyncio.coroutine
def transfer(channel, cbnum):
    #ch = str('SIP'+'/'+cbnum+'@806889')
    os.chdir('/home/chief/area/caller/')
    conf_file = 'config'
    callmanager = CallManager.from_config(conf_file)
    yield from callmanager.connect()
    call = yield from callmanager.send_originate({
        'Action': 'Redirect',
        'Channel': channel,
        'WaitTime': 20,
        'CallerID': '',
        'Exten': cbnum,
        'Context': 'zadarma-in',
        'Priority': 1})
    callmanager.close()
