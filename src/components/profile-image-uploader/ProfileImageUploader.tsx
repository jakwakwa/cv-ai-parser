'use client';

import { Camera, Check, Upload, User, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import styles from './ProfileImageUploader.module.css';

interface ProfileImageUploaderProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  showPrompt?: boolean;
  onSkip?: () => void;
  onComplete?: (imageUrl?: string) => void;
}

const ProfileImageUploader = ({
  currentImage,
  onImageChange,
  showPrompt = false,
  onSkip,
  onComplete,
}: ProfileImageUploaderProps) => {
  const [previewImage, setPreviewImage] = useState<string>(currentImage || '');
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return 'Please upload a JPEG, PNG, or WebP image file.';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB.';
    }

    return null;
  }, []);

  const processImage = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        // Create canvas for resizing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img: HTMLImageElement = new window.Image();

        img.onload = () => {
          // Calculate new dimensions (max 400x400, maintain aspect ratio)
          const maxSize = 400;
          let { width, height } = img;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

          setPreviewImage(compressedDataUrl);
          onImageChange(compressedDataUrl);
          setIsLoading(false);
        };

        img.onerror = () => {
          setError('Failed to process image. Please try another file.');
          setIsLoading(false);
        };

        img.src = URL.createObjectURL(file);
      } catch (_err) {
        setError('Failed to process image. Please try again.');
        setIsLoading(false);
      }
    },
    [onImageChange, validateFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files?.[0]) {
        processImage(e.dataTransfer.files[0]);
      }
    },
    [processImage]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        processImage(e.target.files[0]);
      }
    },
    [processImage]
  );

  const handleRemoveImage = () => {
    setPreviewImage('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSkip = () => {
    console.log('Skip button clicked');
    if (onSkip) {
      onSkip();
    }
  };

  const handleComplete = () => {
    console.log('Complete button clicked with image:', previewImage);
    if (onComplete) {
      onComplete(previewImage);
    }
  };

  // Prompt mode for after resume upload
  if (showPrompt) {
    return (
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <div className={styles.iconContainer}>
            <Camera className={styles.icon} />
          </div>
          <CardTitle className={styles.cardTitle}>
            Add Profile Picture
          </CardTitle>
          <CardDescription className={styles.cardDescription}>
            Make your resume stand out with a professional photo.
          </CardDescription>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          <button
            type="button"
            className={`${styles.uploadArea} ${
              dragActive
                ? styles.uploadAreaDragActive
                : previewImage
                  ? styles.uploadAreaWithImage
                  : styles.uploadAreaDefault
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />

            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <p className={styles.loadingText}>Processing image...</p>
              </div>
            ) : previewImage ? (
              <div className={styles.previewContainer}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={previewImage || '/placeholder.svg'}
                    alt="Profile preview"
                    className={styles.previewImage}
                    width={400}
                    height={400}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className={styles.removeButton}
                  >
                    <X className={styles.removeIcon} />
                  </button>
                </div>
                <div className={styles.successContainer}>
                  <Check className={styles.checkIcon} />
                  <span className={styles.successText}>Image Selected</span>
                </div>
                <p className={styles.instructionText}>Click image to change</p>
              </div>
            ) : (
              <div className={styles.uploadPromptContainer}>
                <User className={styles.uploadIcon} />
                <p className={styles.uploadText}>
                  Click to upload or drag & drop
                </p>
                <p className={styles.instructionText}>
                  JPEG, PNG, or WebP (max 5MB)
                </p>
              </div>
            )}
          </button>

          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.errorText}>{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className={styles.cardFooter}>
          <Button
            variant="outline"
            onClick={handleSkip}
            className={styles.skipButton}
            disabled={isLoading}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleComplete}
            className={styles.completeButton}
            disabled={isLoading}
          >
            {previewImage ? 'Use This Image' : 'Continue Without Image'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Editor mode for resume editing
  return (
    <div className={styles.container}>
      <div className={styles.editorContainer}>
        <div className={styles.editorContent}>
          {previewImage && (
            <div className={styles.editorImageWrapper}>
              <Image
                src={previewImage || '/placeholder.svg'}
                alt="Profile"
                className={styles.editorImage}
                width={400}
                height={400}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className={styles.editorRemoveButton}
              >
                <X className={styles.editorRemoveIcon} />
              </button>
            </div>
          )}
          <div className={styles.editorButtonContainer}>
            <Button
              onClick={handleButtonClick}
              variant="default"
              className={styles.uploadButton}
              disabled={isLoading}
            >
              <Upload className={styles.uploadButtonIcon} />
              {previewImage ? 'Change Image' : 'Upload Image'}
            </Button>
            <p className={styles.editorInstructionText}>
              JPEG, PNG, or WebP (max 5MB)
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.editorUploadArea} ${
            dragActive
              ? styles.editorUploadAreaDragActive
              : styles.editorUploadAreaDefault
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
          <p className={styles.editorUploadText}>
            Or drag and drop your image here
          </p>
        </button>

        {isLoading && (
          <div className={styles.editorLoadingContainer}>
            <div className={styles.editorSpinner} />
            <span className={styles.editorLoadingText}>Processing...</span>
          </div>
        )}

        {error && (
          <div className={styles.editorErrorContainer}>
            <p className={styles.editorErrorText}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileImageUploader;
