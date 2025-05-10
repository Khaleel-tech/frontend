"use client";
import React from "react";
import BookRide from "../../components/BookRide/BookRide";
import Layout from "@/components/Layout/Layout";
import GuardComponent from "@/components/Auth/GuardComponent";

function page() {
  return (
    <GuardComponent>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <BookRide />
        </div>
      </Layout>
    </GuardComponent>
  );
}

export default page;
