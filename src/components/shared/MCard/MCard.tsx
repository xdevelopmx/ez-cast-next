import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { CSSProperties, FC } from "react";

interface CardProps {
	children?: JSX.Element,
	card_style?: CSSProperties,
	media?: {
		height: number,
		src: string,
		alt?: string
	},
	actions?: {
		callback: (action_label: string) => void,
		label: string,
		color: string,
		text_color?: string,
		size: 'small' | 'medium' | 'large' 
	}[],

}

const MCard: FC<CardProps> = ({ children, card_style, media, actions }) => {

	return (
		<Card style={card_style}>
			<CardActionArea>
				{media &&
					<CardMedia
						component="img"
						height={media.height}
						image={media.src}
						alt={media.alt ? media.alt : 'Imagen tarjeta'}
					/>
				}
				<CardContent>
					{children}
				</CardContent>
			</CardActionArea>
			{actions && 
				<CardActions>
					{actions.map((action, i) => <Button 
						key={i} 
						size={action.size} 
						onClick={() => { action.callback(action.label) }}
						style={{background: action.color, color: (action.text_color) ? action.text_color : 'white'}}>
							{action.label}
						</Button>)
					}
				</CardActions>
			}
		</Card>
	)
}

export default MCard;