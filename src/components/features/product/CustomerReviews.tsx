"use client";

import { FaStar, FaCheckCircle } from "react-icons/fa";

type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "meena",
    rating: 5,
    date: "03/28/2023",
    comment:
      "I've noticed a boost in my metabolism since I started taking these tablets. They're a game-changer.",
  },
  {
    id: 2,
    name: "aarti",
    rating: 5,
    date: "03/28/2023",
    comment:
      "These tablets have become an essential part of my daily health routine.",
  },
  {
    id: 3,
    name: "shivani",
    rating: 5,
    date: "03/27/2023",
    comment:
      "Great quality and very effective. Highly recommended.",
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-black">
            Customer Reviews
          </h2>

          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2">
              <div className="flex text-[#4CAF50]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-sm text-black/70">
                <span className="font-medium">4.78 out of 5</span>
                <br className="sm:hidden" />
                <span className="ml-1">
                  Based on 2579 reviews. Average 4.78 out of 5.
                </span>
              </p>
            </div>

            <button className="rounded-md bg-[#245C2A] px-6 py-2 text-sm font-medium text-white hover:opacity-90">
              Write a review
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 border-t" />

        {/* Sort */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-black/70">Most Recent</p>
        </div>

        {/* Reviews */}
        <div className="space-y-8">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex text-[#4CAF50]">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} size={14} />
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-green-700">
                      <FaCheckCircle />
                      Verified
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-medium capitalize">
                    {review.name}
                  </p>
                </div>

                <span className="text-xs text-black/40">
                  {review.date}
                </span>
              </div>

              <p className="mt-3 max-w-3xl text-sm text-black/70">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
