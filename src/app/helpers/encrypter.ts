import { AVAILABLE_PASSWORD_CHARACTERS } from "../model/constants";

export class Encrypter {
  constructor() { }

  public static encrypt(message: string): string {
    const key = '$00P3Rt@jny$HYFR';
    const characters = AVAILABLE_PASSWORD_CHARACTERS.split('');

    return message.split('').map((curr, index) => {
      const currCharCode = curr.charCodeAt(0);
      const messageContentBasedShift = message.charCodeAt(0) + message.charCodeAt(message.length - 1);
      const messageLengthBasedShift = key.charCodeAt((index + message.length) % (key.length - 1));
      const newCharIndex = (currCharCode + messageLengthBasedShift + messageContentBasedShift) % characters.length - 1;

      return characters[newCharIndex];
    })
      .reverse()
      .join('');
  }
}