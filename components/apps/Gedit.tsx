import React, { Component, createRef, ChangeEvent } from 'react';
import emailjs from '@emailjs/browser';

interface GeditState {
    sending: boolean;
}

export class Gedit extends Component<{}, GeditState> {
    private nameRef = createRef<HTMLInputElement>();
    private subjectRef = createRef<HTMLInputElement>();
    private messageRef = createRef<HTMLTextAreaElement>();

    constructor(props: {}) {
        super(props);
        this.state = {
            sending: false,
        };
    }

    componentDidMount() {
        if (process.env.NEXT_PUBLIC_USER_ID) {
            emailjs.init(process.env.NEXT_PUBLIC_USER_ID);
        }
    }

    sendMessage = async () => {
        const name = this.nameRef.current?.value.trim() || '';
        const subject = this.subjectRef.current?.value.trim() || '';
        const message = this.messageRef.current?.value.trim() || '';

        if (!name) {
            this.nameRef.current!.value = '';
            this.nameRef.current!.placeholder = 'Name must not be Empty!';
        }
        if (!message) {
            this.messageRef.current!.value = '';
            this.messageRef.current!.placeholder = 'Message must not be Empty!';
        }
        if (!name || !message) return;

        this.setState({ sending: true });

        const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID!;
        const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID!;
        const templateParams = { name, subject, message };

        try {
            await emailjs.send(serviceID, templateID, templateParams);
        } catch (error) {
            console.error("Email send failed:", error);
        } finally {
            this.setState({ sending: false });
            document.getElementById("close-gedit")?.click();
        }

    };

    handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        this.setState((prevState) => ({
            ...prevState,
            [id]: value
        }) as GeditState);
    };    

    render() {
        return (
            <div className="w-full h-full relative flex flex-col bg-ub-cool-grey text-white select-none">
                <div className="flex items-center justify-between w-full bg-ub-gedit-light bg-opacity-60 border-b border-t border-blue-400 text-sm">
                    <span className="font-bold ml-2">Send a Message to Me</span>
                    <div className="flex">
                        <div onClick={this.sendMessage} className="border border-black bg-black bg-opacity-50 px-3 py-0.5 my-1 mx-1 rounded hover:bg-opacity-80">Send</div>
                    </div>
                </div>
                <div className="relative flex-grow flex flex-col bg-ub-gedit-dark font-normal windowMainScreen">
                    <div className="absolute left-0 top-0 h-full px-2 bg-ub-gedit-darker"></div>
                    <div className="relative">
                        <input 
                            ref={this.nameRef} 
                            className="w-full text-ubt-gedit-orange focus:bg-ub-gedit-light outline-none font-medium text-sm pl-6 py-0.5 bg-transparent" 
                            placeholder="Your Email / Name :" 
                            spellCheck={false} 
                            autoComplete="off" 
                            type="text" 
                        />
                        <span className="absolute left-1 top-1/2 transform -translate-y-1/2 font-bold text-sm text-ubt-gedit-blue">1</span>
                    </div>
                    <div className="relative">
                        <input 
                            ref={this.subjectRef} 
                            className="w-full my-1 text-ubt-gedit-blue focus:bg-ub-gedit-light gedit-subject outline-none text-sm font-normal pl-6 py-0.5 bg-transparent" 
                            placeholder="Subject (may be a feedback for this website!)" 
                            spellCheck={false} 
                            autoComplete="off" 
                            type="text" 
                        />
                        <span className="absolute left-1 top-1/2 transform -translate-y-1/2 font-bold text-sm text-ubt-gedit-blue">2</span>
                    </div>
                    <div className="relative flex-grow">
                        <textarea 
                            ref={this.messageRef} 
                            className="w-full gedit-message font-light text-sm resize-none h-full windowMainScreen outline-none tracking-wider pl-6 py-1 bg-transparent" 
                            placeholder="Message" 
                            spellCheck={false} 
                            autoComplete="off" 
                        />
                        <span className="absolute left-1 top-1 font-bold text-sm text-ubt-gedit-blue">3</span>
                    </div>
                </div>
                {this.state.sending && (
                    <div className="flex justify-center items-center animate-pulse h-full w-full bg-gray-400 bg-opacity-30 absolute top-0 left-0">
                        <img className="w-8 absolute animate-spin" src="./themes/Yaru/status/process-working-symbolic.svg" alt="Ubuntu Process Symbol" />
                    </div>
                )}
            </div>
        );
    }
}

export default Gedit;

export const displayGedit = () => {
    return <Gedit />;
};
