import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [formType, setFormType] = useState('add'); // "add", "update", "partialUpdate"
  const [formData, setFormData] = useState({ id: '', judul: '', deskripsi: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.judul) errors.judul = 'Judul tidak boleh kosong';
    if (!formData.deskripsi) errors.deskripsi = 'Deskripsi tidak boleh kosong';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    setErrors({});
    if (formType === 'add') {
      await createPost();
    } else if (formType === 'update') {
      await updatePost();
    } else if (formType === 'partialUpdate') {
      await partialUpdatePost();
    }
    resetForm();
    fetchPosts();
  };

  const createPost = async () => {
    try {
      await axios.post(`${API_URL}/api/posts`, {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
      });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const updatePost = async () => {
    try {
      await axios.put(`${API_URL}/api/posts/${formData.id}`, {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
      });
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const partialUpdatePost = async () => {
    try {
      await axios.patch(`${API_URL}/api/posts/${formData.id}`, {
        judul: formData.judul,
        deskripsi: formData.deskripsi,
      });
    } catch (error) {
      console.error('Error partially updating post:', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  };

  const resetForm = () => {
    setFormType('add');
    setFormData({ id: '', judul: '', deskripsi: '' });
    setErrors({});
  };

  return (
    <div className='bg-white flex justify-center py-28 w-full min-h-screen'>
      <div className='flex flex-col items-center w-full'>
        
        <div className='w-3/4'>
          <h1 className='text-center font-bold text-2xl'>
            {formType === 'add' && 'Add New Post'}
            {formType === 'update' && 'Update Post'}
            {formType === 'partialUpdate' && 'Update Post Partially'}
          </h1>
          <form className='flex flex-col py-5 w-full' onSubmit={handleSubmit}>
            {formType !== 'add' && (
              <input
                type='hidden'
                name='id'
                value={formData.id}
                onChange={handleInputChange}
              />
            )}
            <input
              type='text'
              name='judul'
              value={formData.judul}
              onChange={handleInputChange}
              className={`border-2 p-2 text-lg font-semibold rounded-lg ${errors.judul ? 'border-red-500' : 'border-black'}`}
              placeholder='Judul'
            />
            {errors.judul && <p className="text-red-500">{errors.judul}</p>}
            <textarea
              name='deskripsi'
              value={formData.deskripsi}
              onChange={handleInputChange}
              className={`border-2 p-2 mt-5 text-lg font-semibold rounded-lg ${errors.deskripsi ? 'border-red-500' : 'border-black'}`}
              placeholder='Deskripsi'
            />
            {errors.deskripsi && <p className="text-red-500">{errors.deskripsi}</p>}
            <button type='submit' className='border mt-5 bg-blue-500 py-4 font-semibold text-lg text-white rounded-lg'>
              {formType === 'add' && 'Create'}
              {formType === 'update' && 'Update'}
              {formType === 'partialUpdate' && 'Update Partially'}
            </button>
          </form>
        </div>

        <div className='w-3/4 mt-16'>
          <h1 className='text-center font-bold text-2xl'>Post List</h1>
          <div className='flex flex-wrap justify-center items-center'>
            {posts.map((post) => (
              <div key={post.id} className='mt-4 p-5 mr-5 drop-shadow-lg bg-white rounded-lg w-48'>
                <div className='text-center text-xl font-semibold line-clamp-1'>{post.judul}</div>
                <div className='mt-2 text-center text-md font-semibold line-clamp-1'>{post.deskripsi}</div>
                <button
                  onClick={() => {
                    setFormType('update');
                    setFormData({ id: post.id, judul: post.judul, deskripsi: post.deskripsi });
                  }}
                  className='p-2 rounded-md mt-2 w-full text-white font-semibold bg-blue-800'
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setFormType('partialUpdate');
                    setFormData({ id: post.id, judul: post.judul, deskripsi: post.deskripsi });
                  }}
                  className='p-2 rounded-md mt-2 w-full text-white font-semibold bg-blue-800'
                >
                  Partial Update
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className='p-2 rounded-md mt-2 w-full text-white font-semibold bg-blue-800'
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
