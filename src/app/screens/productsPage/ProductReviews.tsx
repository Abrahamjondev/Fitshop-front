import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import moment from "moment";
import { Review } from "../../../lib/types/review";
import ReviewService from "../../services/ReviewService";
import { useGlobals } from "../../hooks/useGlobals";
import { getImagePath } from "../../../lib/utils";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";

const colors = {
  card: "#FFFFFF",
  border: "#E6E8EC",
  accent: "#0E7C5A",
  text: "#0E1116",
  textMuted: "#444C58",
};

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { authMember } = useGlobals();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const limit = 5;

  const loadReviews = (targetPage: number, append: boolean) => {
    const service = new ReviewService();
    service
      .getProductReviews(productId, targetPage, limit)
      .then((data) => {
        setTotal(data.total);
        setAverage(data.average);
        setReviews((prev) => (append ? [...prev, ...data.list] : data.list));
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setPage(1);
    loadReviews(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Foydalanuvchining mavjud sharhini formaga oldindan to'ldiramiz
  useEffect(() => {
    if (!authMember) {
      setRating(0);
      setComment("");
      return;
    }
    const mine = reviews.find((r) => r.memberId === authMember._id);
    if (mine) {
      setRating(mine.reviewRating);
      setComment(mine.reviewComment ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMember, reviews.length]);

  const handleSubmit = async () => {
    try {
      if (!authMember) throw new Error("Please login first!");
      if (!rating || rating < 1)
        throw new Error("Please select a star rating!");

      setSubmitting(true);
      const service = new ReviewService();
      await service.createReview(productId, {
        reviewRating: rating,
        reviewComment: comment.trim(),
      });
      await sweetTopSmallSuccessAlert("Review saved!", 900);
      loadReviews(1, false);
      setPage(1);
    } catch (err) {
      console.error(err);
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadReviews(next, true);
  };

  const hasMore = reviews.length < total;

  return (
    <Box sx={{ mt: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 2, flexWrap: "wrap" }}
      >
        <Typography sx={{ color: colors.text, fontSize: 24, fontWeight: 800 }}>
          Reviews
        </Typography>
        {total > 0 && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Rating
              value={average}
              precision={0.1}
              readOnly
              icon={<StarRoundedIcon fontSize="inherit" />}
              emptyIcon={
                <StarBorderRoundedIcon
                  fontSize="inherit"
                  sx={{ color: colors.border }}
                />
              }
              sx={{ color: colors.accent }}
            />
            <Typography sx={{ color: colors.textMuted }}>
              {average.toFixed(1)} · {total} review{total > 1 ? "s" : ""}
            </Typography>
          </Stack>
        )}
      </Stack>

      {/* Sharh qoldirish formasi — faqat login bo'lganlar uchun */}
      {authMember ? (
        <Box
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: "16px",
            bgcolor: colors.card,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography sx={{ color: colors.text, fontWeight: 700, mb: 1 }}>
            Share your experience
          </Typography>
          <Rating
            value={rating}
            onChange={(_, value) => setRating(value)}
            icon={<StarRoundedIcon fontSize="inherit" />}
            emptyIcon={
              <StarBorderRoundedIcon
                fontSize="inherit"
                sx={{ color: colors.border }}
              />
            }
            sx={{ color: colors.accent, mb: 1.5 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Tell others what you think (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                color: colors.text,
                bgcolor: "#F6F7F9",
                borderRadius: "12px",
                "& fieldset": { borderColor: colors.border },
                "&:hover fieldset": { borderColor: colors.accent },
                "&.Mui-focused fieldset": {
                  borderColor: colors.accent,
                  borderWidth: "1.5px",
                },
              },
              "& .MuiOutlinedInput-input": { fontWeight: 500 },
            }}
          />
          <Button
            variant="contained"
            disableElevation
            onClick={handleSubmit}
            disabled={submitting}
            sx={{
              px: 3,
              height: 46,
              borderRadius: "999px",
              background:
                "linear-gradient(135deg, #12A074 0%, #0E7C5A 52%, #0A5E44 100%)",
              color: "#FFFFFF",
              fontWeight: 800,
              textTransform: "none",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 26px -14px rgba(14,124,90,0.8)",
              transition: "all 320ms cubic-bezier(0.32,0.72,0,1)",
              "&:hover": {
                filter: "brightness(1.05)",
                transform: "translateY(-1px)",
              },
              "&.Mui-disabled": {
                background: "rgba(14,17,22,0.06)",
                color: "#9AA1AB",
              },
            }}
          >
            {submitting ? "Saving..." : "Submit review"}
          </Button>
        </Box>
      ) : (
        <Typography sx={{ color: colors.textMuted, mb: 3 }}>
          Login to leave a review.
        </Typography>
      )}

      {/* Sharhlar ro'yxati */}
      {reviews.length === 0 ? (
        <Typography sx={{ color: colors.textMuted }}>
          No reviews yet. Be the first to review this product.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Box
              key={review._id}
              sx={{
                p: 2,
                borderRadius: "14px",
                bgcolor: colors.card,
                border: `1px solid ${colors.border}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  src={getImagePath(review.memberImage)}
                  alt={review.memberNick}
                  sx={{ width: 40, height: 40 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: colors.text, fontWeight: 700 }}>
                    {review.memberNick ?? "FitShop Member"}
                  </Typography>
                  <Typography sx={{ color: colors.textMuted, fontSize: 12 }}>
                    {moment(review.createdAt).format("YYYY-MM-DD")}
                  </Typography>
                </Box>
                <Rating
                  value={review.reviewRating}
                  readOnly
                  size="small"
                  icon={<StarRoundedIcon fontSize="inherit" />}
                  emptyIcon={
                    <StarBorderRoundedIcon
                      fontSize="inherit"
                      sx={{ color: colors.border }}
                    />
                  }
                  sx={{ color: colors.accent }}
                />
              </Stack>
              {review.reviewComment ? (
                <>
                  <Divider sx={{ my: 1.2, borderColor: colors.border }} />
                  <Typography sx={{ color: colors.textMuted }}>
                    {review.reviewComment}
                  </Typography>
                </>
              ) : null}
            </Box>
          ))}

          {hasMore && (
            <Button
              onClick={handleLoadMore}
              variant="outlined"
              sx={{
                alignSelf: "center",
                borderColor: colors.accent,
                color: colors.accent,
                "&:hover": { bgcolor: "rgba(14, 124, 90,0.1)" },
              }}
            >
              Show more reviews
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
}
