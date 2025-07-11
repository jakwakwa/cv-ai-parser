import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/ui-button/button';
import SectionHeader from '../section-header/section-header';
import styles from './skills-editor-section.module.css';
import SkillPill from './skills-utils/skill-pill';

interface SkillsEditorSectionProps {
  skills: string[];
  onSkillAdd: (skill: string) => void;
  onSkillRemove: (skill: string) => void;
}

const SkillsEditorSection = ({
  skills,
  onSkillAdd,
  onSkillRemove,
}: SkillsEditorSectionProps) => {
  const handleAddSkill = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    const input =
      e.currentTarget.parentElement?.querySelector<HTMLInputElement>('input');
    if (input?.value.trim()) {
      onSkillAdd(input.value.trim());
      input.value = '';
    }
  };

  return (
    <Card className={styles.card}>
      <SectionHeader title="Skills" />
      <CardContent>
        <div className={styles.skillsInputGroup}>
          <Input
            type="text"
            placeholder="Add a new skill (e.g., React, Node.js)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSkill(e);
              }
            }}
            className={styles.input}
          />
          <Button onClick={handleAddSkill} className={styles.addSkillButton}>
            <Plus className={styles.iconMd} />
          </Button>
        </div>
        <div className={styles.skillsList}>
          {skills?.map((skill, index) => {
            const skillKey = `${skill.replace(/\s+/g, '-').toLowerCase()}-${index}`;
            return (
              <SkillPill
                key={skillKey}
                onRemove={onSkillRemove}
                skill={skill}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsEditorSection;
