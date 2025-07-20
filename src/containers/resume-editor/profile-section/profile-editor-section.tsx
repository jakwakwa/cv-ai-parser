import type { ParsedResumeSchema } from '@/lib/tools-lib/shared-parsed-resume-schema';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import ProfileImageUploader from '@/src/containers/profile-image-uploader/profile-image-uploader';
import SectionHeader from '../section-header/section-header';
import styles from './profile-editor-section.module.css';

interface ProfileEditorSectionProps {
  profileImage: string | undefined;
  contact: ParsedResumeSchema['contact'];
  onProfileImageChange: (url: string) => void;
  onContactChange: <K extends keyof NonNullable<ParsedResumeSchema['contact']>>(
    field: K,
    value: NonNullable<ParsedResumeSchema['contact']>[K]
  ) => void;
}

const ProfileEditorSection = ({
  profileImage,
  contact,
  onProfileImageChange,
  onContactChange,
}: ProfileEditorSectionProps) => {
  return (
    <>
      <Card className={styles.card}>
        <SectionHeader title="Profile Information" />
        <CardContent>
          <ProfileImageUploader
            currentImage={profileImage}
            onImageChange={onProfileImageChange}
          />
        </CardContent>
      </Card>
      <Card className={styles.card}>
        <SectionHeader title="Contact Information" />
        <CardContent>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <Label htmlFor="email" className={styles.label}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={contact?.email || ''}
                onChange={(e) => onContactChange('email', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <Label htmlFor="phone" className={styles.label}>
                Phone
              </Label>
              <Input
                id="phone"
                value={contact?.phone || ''}
                onChange={(e) => onContactChange('phone', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <Label htmlFor="location" className={styles.label}>
                Location (City, Country)
              </Label>
              <Input
                id="location"
                value={contact?.location || ''}
                onChange={(e) => onContactChange('location', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <Label htmlFor="linkedin" className={styles.label}>
                LinkedIn Profile URL
              </Label>
              <Input
                id="linkedin"
                value={contact?.linkedin || ''}
                onChange={(e) => onContactChange('linkedin', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <Label htmlFor="github" className={styles.label}>
                GitHub Profile URL
              </Label>
              <Input
                id="github"
                value={contact?.github || ''}
                onChange={(e) => onContactChange('github', e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formField}>
              <Label htmlFor="website" className={styles.label}>
                Personal Website URL
              </Label>
              <Input
                id="website"
                value={contact?.website || ''}
                onChange={(e) => onContactChange('website', e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileEditorSection;
