import { useCallback, useState } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useLoginModal from "@/hooks/useLoginModal";
import usePosts from "@/hooks/usePosts";
import useRegisterModal from "@/hooks/useRegisterModal";
import { toast } from "react-hot-toast";
import axios from "axios";

import Button from "./Button";
import Avatar from "./Avatar";
import usePost from "@/hooks/usePost";

interface FormProps {
    placeholder: string;
    isComment?: boolean;
    postId?: string;
}

const Form: React.FC<FormProps> = ({
    placeholder,
    isComment,
    postId
}) => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();

    const { data: currentUser } = useCurrentUser();
    const { mutate: mutatePosts } = usePosts();
    const { mutate: mutatePost } = usePost(postId as string);

    const [body, setBody] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = useCallback(async () => {
        try {
            setIsLoading(true);

            const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts';

            await axios.post(url, { body });

            if (!isComment) {
                toast.success('Your post hit the web!')
            } else {
                toast.success('Your comment hit the post!')
            }

            mutatePosts();
            mutatePost();
            setBody('');

        } catch (error) {
            toast.error('Something went wrong, try again later.');
        } finally {
            setIsLoading(false);
        }
    }, [body, mutatePosts, mutatePost, isComment, postId]);

    return (
        <div className="border-b-[1px] border-neutral-800 px-6 py-2">
            {currentUser ? (
                <div className="flex flex-row gap-4">
                    <div>
                        <Avatar userId={currentUser?.id} />
                    </div>
                    <div className="w-full">
                        <textarea
                            disabled={isLoading}
                            onChange={(e) => setBody(e.target.value)}
                            value={body}
                            className="
                                disabled:opacity-80
                                peer
                                resize-none
                                mt-3
                                w-full
                                bg-black
                                ring-0
                                outline-none
                                text-[20px]
                                placeholder-neutral-500
                                text-white
                            "
                            placeholder={placeholder}
                        ></textarea>
                        <hr 
                            className="
                                opacity-0
                                peer-focus:opacity-100
                                h-[1px]
                                w-full
                                border-neutral-800
                                transiiton
                            "
                        />
                        <div className="mt-4 flex flex-row justify-end">
                            <Button
                                disabled={isLoading || !body}
                                onClick={onSubmit}
                                label="Shoot"/>
                        </div>
                    </div>
                </div>
            ) : (
            <div className="py-8">
                <h1 className="text-white text-2xl text-center mb-4 font-bold">Welcome to Arachweb</h1>
                <div className="flex flex-row items-center justify-center gap-4">
                    <Button label="Login" onClick={loginModal.onOpen}/>
                    <Button secondary label="Sign up" onClick={registerModal.onOpen}/>
                </div>
            </div>
            )}
        </div>
    );
}

export default Form;