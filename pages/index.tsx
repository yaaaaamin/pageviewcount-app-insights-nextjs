import type { NextPage } from "next";
import Head from "next/head";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  createStyles,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { Search } from "@material-ui/icons";
import { useMutation, useQuery } from "react-query";

const useClasses = makeStyles(
  () =>
    createStyles({
      root: {
        "&.SrlHome-root": {
          maxWidth: "100vw",
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
      card: {
        "&.SrlCard-root": {
          width: "200px",
          height: "200px",
        },
      },
      content: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "150px",
        textAlign: "center",
      },
    }),
  {
    classNamePrefix: "SrlHome",
  }
);

const pageViewCount = async (
  slug: string
): Promise<{ pageViewCustomStore?: number }> => {
  try {
    const response = await fetch(`/api/page-view-count?slug=${slug}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return { pageViewCustomStore: 0 };
  }
};

const Home: NextPage = () => {
  const classes = useClasses();
  const [pageViewCustomStore, setPageViewCustomStore] = useState(0);

  const { mutate, isLoading } = useMutation(pageViewCount, {
    onSuccess: (data) => setPageViewCustomStore(data?.pageViewCustomStore || 0),
  });

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutate(formData.get("slug")?.toString()!);
  };

  return (
    <>
      <Head>
        <title>Page View Count: {pageViewCustomStore}</title>
      </Head>
      <main className={clsx("SrlHome-root", classes.root)}>
        <Card className={clsx("SrlCard-root", classes.card)} elevation={12}>
          <CardContent component="form" onSubmit={handleOnSubmit}>
            <TextField
              name="slug"
              label="Slug"
              required
              autoFocus
              InputProps={{
                readOnly: isLoading,
                endAdornment: (
                  <InputAdornment position="end">
                    {!isLoading ? (
                      <IconButton size="small" type="submit" color="primary">
                        <Search />
                      </IconButton>
                    ) : (
                      <CircularProgress size="24px" color="secondary" />
                    )}
                  </InputAdornment>
                ),
              }}
            />
            <div className={clsx(classes.content)}>
              <Typography variant="h3" color="primary">
                {pageViewCustomStore}
                <Typography paragraph color="textPrimary">
                  visitas
                </Typography>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Home;
