import { useCallback, useState } from 'react';

import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, H4, Paragraph, Popover, View } from 'tamagui';

import { color } from '@theme/tokens';

import Left from '@components/icons/chevron-left.svg?react';
import User from '@components/icons/user.svg?react';

type DefaultHeader = {
	canGoBack: boolean;
	defaultTo: string;
	customNavigation?: never;
};

type CustomHeader = {
	canGoBack?: never;
	defaultTo?: never;
	customNavigation: () => void;
};

export type HeaderProps = (DefaultHeader | CustomHeader) & {
	children: string;
	profile?: boolean;
	tainted?: boolean;
};

const Header = ({
	children,
	canGoBack = true,
	defaultTo,
	customNavigation,
	profile = false,
	tainted = false,
}: HeaderProps) => {
	const navigate = useNavigate();
	const location = useLocation();

	const [open, setOpen] = useState(false);
	const navigateBack = useCallback(() => {
		if (customNavigation) {
			customNavigation();
		} else {
			if (location.key !== 'default' && canGoBack) {
				navigate(-1);
			} else {
				navigate(defaultTo);
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [canGoBack, defaultTo, location.key]);

	return (
		<>
			<View
				pos="relative"
				borderRadius="$full"
				mx="$4"
				mt="$4"
				py="$2"
				px="$12"
				pr={profile ? '$12' : '$4'}
			>
				{!tainted && (
					<Button
						pos="absolute"
						top="$2"
						left="$0"
						ai="center"
						jc="center"
						minHeight="initial"
						height="initial"
						p="$1"
						borderRadius="$full"
						color="$baseStromeeNavy"
						bg="$transparent"
						borderStyle="solid"
						borderWidth="1px"
						borderColor="$transparent"
						hoverStyle={{
							bg: '$transparent',
						}}
						focusStyle={{
							bg: '$transparent',
						}}
						onPress={() => {
							navigateBack();
						}}
					>
						<AccessibleIcon label="zurück">
							<Left style={{ color: color.baseStromeeNavy }} />
						</AccessibleIcon>
					</Button>
				)}
				{tainted && (
					<Popover
						placement="bottom-start"
						allowFlip={true}
						stayInFrame
						open={open}
						onOpenChange={setOpen}
					>
						<Popover.Trigger
							position="absolute"
							alignSelf="flex-start"
							asChild
							top="$2"
							right="$1"
						>
							<Button
								pos="absolute"
								top="$2"
								left="$0"
								ai="center"
								jc="center"
								minHeight="initial"
								height="initial"
								p="$1"
								borderRadius="$full"
								color="$baseStromeeNavy"
								width="fit-content"
								bg="$transparent"
								borderStyle="solid"
								borderWidth="1px"
								borderColor="$transparent"
								hoverStyle={{
									bg: '$transparent',
								}}
								focusStyle={{
									bg: '$transparent',
								}}
								onPress={(e) => {
									e.preventDefault();
									setOpen(true);
								}}
							>
								<AccessibleIcon label="zurück">
									<Left
										style={{ color: color.baseStromeeNavy }}
									/>
								</AccessibleIcon>
							</Button>
						</Popover.Trigger>

						<Popover.Content
							p="$4"
							ml="$-1"
							enterStyle={{ y: -10, opacity: 0 }}
							exitStyle={{ y: -10, opacity: 0 }}
							shadowColor="$baseStromeeNavyOpacity20"
							shadowRadius={8}
							animation={[
								'quick',
								{
									opacity: {
										overshootClamping: true,
									},
								},
							]}
							gap="$2"
						>
							<Paragraph
								borderTopLeftRadius="$4"
								borderTopRightRadius="$4"
								borderBottomLeftRadius="$0"
								borderBottomRightRadius="$0"
								fontWeight="bold"
							>
								Du hast ungesicherte Änderungen:
							</Paragraph>
							<Popover.Close asChild flexDirection="row">
								<Button
									theme="base"
									size="$true"
									height="initial"
									minHeight="initial"
									width="$full"
									borderRadius="$full"
									borderColor="$borderColor"
									py="$2"
									px="$4"
									ai="center"
									jc="center"
									onPress={(e) => {
										e.stopPropagation();
										/* Custom code goes here, does not interfere with popover closure */
									}}
									focusStyle={{
										zi: 1,
									}}
								>
									Weiter bearbeiten
								</Button>
							</Popover.Close>
							<Popover.Close asChild flexDirection="row">
								<Button
									theme="lollipopRed"
									size="$true"
									height="initial"
									minHeight="initial"
									width="$full"
									borderRadius="$full"
									py="$2"
									px="$4"
									ai="center"
									jc="center"
									onPress={(e) => {
										navigateBack();
										e.stopPropagation();
										/* Custom code goes here, does not interfere with popover closure */
									}}
									focusStyle={{
										zi: 1,
									}}
								>
									Änderungen verwerfen
								</Button>
							</Popover.Close>
						</Popover.Content>
					</Popover>
				)}

				<H4 textAlign="center" width="$full" numberOfLines={1}>
					{children}
				</H4>
				{profile && (
					<Button
						pos="absolute"
						top="$2"
						right="$0"
						ai="center"
						jc="center"
						minHeight="initial"
						height="initial"
						p="$1"
						borderRadius="$full"
						color="$baseStromeeNavy"
						bg="$transparent"
						borderStyle="solid"
						borderWidth="1px"
						borderColor="$transparent"
						hoverStyle={{
							bg: '$transparent',
						}}
						focusStyle={{
							bg: '$transparent',
						}}
						onPress={() => {
							navigate('/profile');
						}}
					>
						<AccessibleIcon label="Profil">
							<User style={{ color: color.baseStromeeNavy }} />
						</AccessibleIcon>
					</Button>
				)}
			</View>
		</>
	);
};

export { Header };
