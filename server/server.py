from concurrent import futures
import logging
import uuid
import grpc
import sys 
sys.path.append('C:/Users/user/Documents/Develop Land/grpc/NodeTest/lib/proto')
import users_pb2_grpc as pb2_grpc
import users_pb2 as pb2

users = [
  {
    "id": "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
    "name": "John Brad",
    "age": 23,
    "address": "Address 1",
  },
  {
    "id": "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
    "name": "Mary Anne",
    "age": 45,
    "address": "Address 2",
  },
]

class UserController(pb2_grpc.UserServiceServicer):

    def GetAll(self,request,context):
        return pb2.UserList(users=users)
    def Get(self, request, context):
        pass
        # user.id = str(uuid.uuid4())
        
        
    def Insert(self, request, context):
        user = request
        user.id =  str(uuid.uuid4())
        users.append(user)
        return pb2.User(
            id=user.id,
            name=user.name,
            age=user.age,
            address=user.address
        )
    def Update(self, request, context):
        user = [user for user in users if user['id'] == request.id][0]
        user['id'] = request.id
        user['name'] = request.name
        user['address'] = request.address
        user['age'] = request.age
        return pb2.User(**user)
    def Remove(self, request, context):
        print(request)
        index = next((i for i, user in enumerate(users) if user['id'] == request.id), -1)
        del users[index]
        return pb2.Empty()


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    pb2_grpc.add_UserServiceServicer_to_server(UserController(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Server running at http://127.0.0.1:50051")
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
