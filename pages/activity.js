import React, { useState, useEffect } from 'react'
import { BsHeartFill } from 'react-icons/bs'
import { FiSend } from 'react-icons/fi'
import Head from 'next/head'
import Link from 'next/link'

const Activity = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, [user])

  const getPosts = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/post/getlikedposts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user.username })
    });
    const response = await res.json();

    response.posts.sort(function (a, b) {
      let keyA = new Date(a.updatedAt), keyB = new Date(b.updatedAt);
      if (keyA < keyB) return 1;
      if (keyA > keyB) return -1;
      return 0;
    });
    if (response.success) {
      setPosts(response.posts);
    }
  }

  return (
    <section className="text-gray-600 body-font min-h-screen">
      <Head>
        <title>Telinsta | Activity</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Your Favourites</h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Content liked by you will be displayed here, so that you can get it back later. Use like icon to save content here.</p>
        </div>
        {posts.length > 0 && <div className="flex flex-wrap -m-4">
          {posts.map((post) => {
            return <div className="lg:w-1/3 sm:w-1/2 p-4" key={post._id}>
              <div className="flex relative">
                <img alt="gallery" className="absolute inset-0 w-full h-[40vh] object-contain object-center " src={post.imgLinks[0]} />
                <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100 h-[40vh]">
                  <div className='flex justify-between'>
                    <h2 className="tracking-widest text-sm title-font font-medium text-red-600 mb-1 flex"><BsHeartFill className='text-xl mr-2 ' />{post.likes.length}</h2>
                    <Link href={`/posts/${post._id}`}>
                      <a>
                        <FiSend className='text-2xl hover:text-blue-800' />
                      </a>
                    </Link>
                  </div>
                  <Link href={`/users/${post.username}`}><a className="title-font text-lg font-medium text-gray-900 mb-3 hover:underline hover:text-blue-800">{post.username}</a></Link>
                  <p className="leading-relaxed">{post.desc}</p>
                </div>
              </div>
            </div>
          })}

        </div>}
        {posts.length === 0 && <div className='flex flex-col items-center justify-center h-full'>
          <BsHeartFill className='xl:text-[5rem] text-[4rem] border-red-600 text-red-600 border-4 py-4 rounded-full' />
          <h1 className='text-black text-2xl font-semibold mt-1 mb-2'>Liked content will appear here.</h1>
          <p className='text-gray-800'>It's look like you liked nothing yet.</p>
        </div>}
      </div>
    </section>
  )
}

export default Activity