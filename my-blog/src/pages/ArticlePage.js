import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "./NotFoundPage";
import articles from "./article-content";
import AddCommentForm from "../components/AddCommentForm";
import CommentsList from "../components/CommentsList";
import useUser from "./hooks/useUser";
const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState({
    upvots: 0,
    comments: [],
    canUpvote: false,
  });
  const { canUpvote } = articleInfo;
  const { user, isLoading } = useUser();
  const { articleId } = useParams();
const navigate=useNavigate();
  useEffect(() => {
    const loadArticleInfo = async () => {
      const token = user && (await user.getIdToken());
      const headers = token ? { authtoken: token } : {};
      const response = await axios.get(`/api/articles/${articleId}`, {
        headers,
      });
      setArticleInfo(response.data);
    };

    if (isLoading) {
      loadArticleInfo();
    }
  }, [isLoading, user]);

  const article = articles.find((article) => article.name === articleId);

  const addUpvote = async () => {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.put(
      `/api/articles/${articleId}/upvote`,
      null,
      { headers }
    );
    const updateArticle = response.data;
    setArticleInfo(updateArticle);
  };
  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <>
      <h1>{article.title}</h1>
      <div className="upvotes-section">
        {user ? (
          <button onClick={addUpvote}>
            {canUpvote ? "Upvote" : "Already Upvoted"}
          </button>
        ) : (
          <button onClick={()=>{
            navigate('/login');
          }}>Log in to upvote</button>
        )}
      <p>This article has {articleInfo.upvotes} upvote(s)</p>
      </div>
      {/* <p>Here name from db {articleInfo.name} </p> */}
      {article.content.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      {user ? (
        <AddCommentForm
          articleName={articleId}
          onArticleUpdated={(updatedArticle) => setArticleInfo(updatedArticle)}
        />
      ) : (
        <button onClick={()=>{
          navigate('/login');
        }}>Log In to add comment</button>
      )}
      <CommentsList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;
