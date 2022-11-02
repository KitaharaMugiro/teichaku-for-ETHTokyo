import { Links } from "@/constants/Links";
import { useLocale } from "@/i18n/useLocale";
import { Divider, Group, Space, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { IconBackhoe, IconCoin, IconInfoSquare, IconMessages, IconSettings, IconWalk } from "@tabler/icons";
import Link from "next/link";
import { useRouter } from "next/router";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  path: string;
}

function MainLink({ icon, color, label, path }: MainLinkProps) {
  const currentPath = useRouter().asPath;
  const isActivated = currentPath === path;
  return (
    <Link href={path} passHref>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          backgroundColor: isActivated
            ? theme.fn.variant({ variant: "light", color: theme.primaryColor }).background
            : "transparent",
          color: isActivated
            ? theme.fn.variant({ variant: "light", color: theme.primaryColor }).color
            : theme.colorScheme === "dark"
            ? theme.colors.dark[0]
            : theme.black,

          "&:hover": {
            backgroundColor: isActivated
              ? theme.fn.variant({ variant: "light", color: theme.primaryColor }).background
              : theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          },
        })}
      >
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="md">{label}</Text>
        </Group>
      </UnstyledButton>
    </Link>
  );
}

export const NavbarLinks = () => {
  const { t } = useLocale();
  const { Overviews, History, Assessments, Contribution, SprintReview, Settings, Info, Events, Admin } =
    t.Common.AppMenu;
  const router = useRouter();
  const { daoId, projectId } = router.query;
  let commonPath = Links.getCommonPath(router);
  if (!(daoId && projectId)) {
    commonPath = process.env.NEXT_PUBLIC_DEMO_PATH || commonPath;
  }
  const data = [
    {
      icon: <IconInfoSquare size={16} />,
      color: "green",
      label: Overviews,
      path: commonPath + "/overview",
    },
    { icon: <IconBackhoe size={16} />, color: "teal", label: History, path: commonPath + "/history" },
    {
      icon: <IconCoin size={16} />,
      color: "violet",
      label: Assessments,
      path: commonPath + "/assessments",
    },
  ];
  const event = [
    {
      icon: <IconWalk size={16} />,
      color: "cyan",
      label: Contribution,
      path: commonPath + "/contribution",
    },
    {
      icon: <IconMessages size={16} />,
      color: "indigo",
      label: SprintReview,
      path: commonPath + "/poll",
    },
  ];
  const admin = [
    {
      icon: <IconSettings size={16} />,
      color: "grape",
      label: Settings,
      path: commonPath + "/settings",
    },
  ];

  const dataLinks = data.map((link) => <MainLink {...link} key={link.label} />);
  const eventLinks = event.map((link) => <MainLink {...link} key={link.label} />);
  const adminLinks = admin.map((link) => <MainLink {...link} key={link.label} />);
  return (
    <div>
      <Text color="dimmed">{Info}</Text>
      {dataLinks}
      <Space h="md" />
      <Divider />
      <Space h="md" />
      <Text color="dimmed">{Events}</Text>
      {eventLinks}
      <Space h="md" />
      <Divider />
      <Space h="md" />
      <Text color="dimmed">{Admin}</Text>
      {adminLinks}
    </div>
  );
};
