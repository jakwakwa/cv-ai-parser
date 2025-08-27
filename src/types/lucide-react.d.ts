declare module "lucide-react" {
	import type * as React from "react"

	export interface LucideProps extends React.SVGProps<SVGSVGElement> {
		color?: string
		size?: string | number
		strokeWidth?: string | number
	}

	export type LucideIcon = React.FC<LucideProps>

	export const Camera: LucideIcon
	export const Check: LucideIcon
	export const Upload: LucideIcon
	export const User: LucideIcon
	export const X: LucideIcon
	export const AlertTriangle: LucideIcon
	export const CheckCircle: LucideIcon
	export const ImageIcon: LucideIcon
	export const Palette: LucideIcon
	export const Bot: LucideIcon
	export const ArrowLeft: LucideIcon
	export const ArrowRight: LucideIcon
	export const RotateCcw: LucideIcon
	export const Eye: LucideIcon
	export const EyeOff: LucideIcon
	export const Plus: LucideIcon
	export const Save: LucideIcon
	export const Trash2: LucideIcon
	export const Calendar: LucideIcon
	export const Download: LucideIcon
	export const FileText: LucideIcon
	export const Globe: LucideIcon
	export const Lock: LucideIcon
	export const ChevronDown: LucideIcon
	export const ChevronUp: LucideIcon
	export const ChevronRight: LucideIcon
	export const MoreHorizontal: LucideIcon
	export const Search: LucideIcon
	export const Circle: LucideIcon
	export const Dot: LucideIcon
	export const GripVertical: LucideIcon
	export const PanelLeft: LucideIcon
	export const Moon: LucideIcon
	export const Sun: LucideIcon
	export const Settings: LucideIcon
	export const BrainCircuit: LucideIcon
	export const Code: LucideIcon
	export const Figma: LucideIcon
	export const UploadCloud: LucideIcon

	// Allow importing any other icon by name.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const icons: Record<string, LucideIcon>
	export default icons
}
