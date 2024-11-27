import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";



@WebSocketGateway()
export class AppGateway implements OnGatewayConnection {

    @WebSocketServer() server: Server;



    handleConnection(client: Socket, ...args: any[]) {
        this.handelMassage(client)
    
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket): void {
        // Join a room
        client.join(room);
        this.server.to(room).emit('message', `User ${client.id} has joined room: ${room}`);
    }

    handelMassage(client: Socket): void {
        this.server.emit("work", "Connect In Massage work user id : " + client.id)
    }

    // @SubscribeMessage('message')
    // handleGetMessage(@MessageBody() data: any,@ConnectedSocket() client: Socket): void {
    //     this.server.emit('message', `Server received: ${JSON.stringify(data)}`);
    // }

    @SubscribeMessage('message')
    handleGetMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
        // Emit the received message to a specific room or all clients
        const { room, message } = data; // Assuming data contains the room and message
        if (room) {
            // Send message to the specific room
            this.server.to(room).emit(`${room}`, message);
            // this.server.to(room).emit('message', `Server received: ${JSON.stringify(message)} from user ${client.id}`);
        } else {
            // Send message to all connected clients
            this.server.emit('message', `Server received: ${JSON.stringify(message)} from user ${client.id}`);
        }
    }
}