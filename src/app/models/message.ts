export interface Message {
messageId?: number;
discussionId?: number;
senderId: number;
receiverId: number;
content: string;
sentAt?: string;
senderName?: string;
receiverName?: string;
}