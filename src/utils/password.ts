import {scrypt,randomBytes} from 'crypto';
import {promisify} from 'util';

const asyncScrypt = promisify(scrypt);

export class Password {

    static async toHash(password: string){
        const salt = randomBytes(8).toString('hex');
        // const hashedPassword = scrypt(password,salt,64);
        const buf = (await asyncScrypt(password,salt,64)) as Buffer;

        return `${buf.toString('hex')}.${salt}`;

    }


    static async compare(storedPassword:string,enteredPassword:string){

        const [password,salt] = storedPassword.split('.');
        const hashedPassword = (await asyncScrypt(enteredPassword,salt,64))  as Buffer;

        return hashedPassword.toString('hex')===password;

    }


}